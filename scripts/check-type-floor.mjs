#!/usr/bin/env node
/**
 * Type-floor check. The audience is older adults reading phones outdoors, so
 * this walks every route at 375px and checks the rendered text:
 *
 *   FAIL  any visible text node that computes below 14px (form controls too)
 *   FAIL  Fraunces (the `font-display` class) on anything but an h1, a section
 *         h2 or a price figure. The schedule's day names and everything under
 *         /admin-preview are DM Sans, so h2s there do not count.
 *   INFO  the share of characters under 16px on each page. Target: under 10%.
 *         Add --strict to fail when a page is over it.
 *
 * "Every route" is read from the build (.next/server/app-paths-manifest.json),
 * so a new page is picked up without editing this file. A few routes are also
 * walked in their interactive states (form errors, the success panel, the
 * admin add forms), because that is where small error and hint text lives.
 *
 * Usage
 *   npm run build && npm run check:type          starts `next start` itself
 *   BASE_URL=http://localhost:3000 npm run check:type    uses a running server
 *   npm run check:type -- --verbose              top sub-16px text on each page
 *   npm run check:type -- --json report.json     raw results
 *   CHROMIUM_PATH=/path/to/chrome ...            use a specific Chromium
 */
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWPORT = { width: 375, height: 812 };
const FLOOR_PX = 14;
const READABLE_PX = 16;
const TARGET_PCT = Number(process.env.TYPE_TARGET_PCT ?? 10);

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const VERBOSE = args.includes("--verbose");
const jsonIndex = args.indexOf("--json");
const JSON_OUT = jsonIndex === -1 ? null : args[jsonIndex + 1];

// ---------------------------------------------------------------- the server

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function startServer() {
  const port = await freePort();
  const next = path.join(ROOT, "node_modules/next/dist/bin/next");
  const child = spawn(process.execPath, [next, "start", "-p", String(port)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout.on("data", (d) => (log += d));
  child.stderr.on("data", (d) => (log += d));
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error(`next start exited early. Did you run \`npm run build\`?\n${log}`);
    try {
      if ((await fetch(base)).ok) return { base, stop: () => child.kill("SIGTERM") };
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill("SIGTERM");
  throw new Error(`next start did not come up in 30s\n${log}`);
}

// ----------------------------------------------------------------- the routes

/** Page routes from the build, as URL patterns: "/", "/contact", "/admin-preview/applications/[id]". */
async function routesFromBuild() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, ".next/server/app-paths-manifest.json"), "utf8"));
  return Object.keys(manifest)
    .filter((key) => key.endsWith("/page") && !key.startsWith("/_global-error"))
    .map((key) => (key === "/page" ? "/" : key.slice(0, -"/page".length)))
    .sort();
}

const NOT_FOUND_ROUTE = "/_not-found";
const NOT_FOUND_URL = "/this-page-does-not-exist";

/** Interactive states worth walking, because their text only exists after a click. */
const STATES = {
  "/tournaments": [
    {
      name: "errors shown",
      run: async (page) => {
        await page.getByRole("button", { name: "Send application" }).click();
        await page.waitForSelector("form [role=alert]");
      },
    },
    {
      name: "success panel",
      run: async (page) => {
        await page.locator("form input[name=fullName]").fill("Pat Kim");
        await page.locator("form input[name=phone]").fill("3865550100");
        await page.locator("form select[name=division]").selectOption({ index: 1 });
        await page.getByRole("button", { name: "Send application" }).click();
        await page.waitForSelector("[role=status] h3");
      },
    },
  ],
  "/admin-preview/schedule": [
    {
      name: "add form with error",
      run: async (page) => {
        await page.getByRole("button", { name: "Add" }).click();
        await page.getByRole("button", { name: "Save" }).click();
        await page.waitForSelector("form [role=alert]");
      },
    },
  ],
  "/admin-preview/pricing": [
    {
      name: "add form with error",
      run: async (page) => {
        await page.getByRole("button", { name: "Add" }).click();
        await page.getByRole("button", { name: "Save" }).click();
        await page.waitForSelector("form [role=alert]");
      },
    },
  ],
};

// -------------------------------------------------- measuring (runs in the page)

/** Every visible text node and form control on the page, with its computed type. */
function measurePage() {
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "TITLE", "OPTION", "OPTGROUP"]);

  // Visually hidden on purpose (sr-only, collapsed, transparent)? Then it is not "visible text".
  function visuallyHidden(el) {
    if (getComputedStyle(el).visibility !== "visible") return true;
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.opacity === "0") return true;
      if (cs.position === "absolute" && cs.clip === "rect(0px, 0px, 0px, 0px)") return true;
      if (cs.overflow !== "visible") {
        const box = a.getBoundingClientRect();
        if (box.width <= 1 || box.height <= 1) return true;
      }
    }
    return false;
  }

  function describe(el) {
    const bits = [];
    for (let a = el, i = 0; a && a !== document.body && i < 3; a = a.parentElement, i++) {
      const cls = [...a.classList].filter((c) => /^(text-|font-|uppercase|italic)/.test(c)).slice(0, 3).join(".");
      bits.unshift(a.tagName.toLowerCase() + (a.id ? `#${a.id}` : "") + (cls ? `.${cls}` : ""));
    }
    return bits.join(" > ");
  }

  function record(el, text, kind) {
    const cs = getComputedStyle(el);
    return {
      kind,
      text: text.slice(0, 80),
      chars: text.replace(/\s/g, "").length,
      size: parseFloat(cs.fontSize),
      family: cs.fontFamily,
      weight: cs.fontWeight,
      style: cs.fontStyle,
      tag: el.tagName.toLowerCase(),
      path: describe(el),
      inHeading: Boolean(el.closest("h1, h2")),
      inDayName: Boolean(el.closest('h2[id^="day-"]')),
    };
  }

  const found = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue.replace(/\s+/g, " ").trim();
    const el = node.parentElement;
    if (!text || !el || SKIP_TAGS.has(el.tagName)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    if (![...range.getClientRects()].some((r) => r.width > 0 && r.height > 0)) continue; // display:none
    if (visuallyHidden(el)) continue;
    found.push(record(el, text, "text"));
  }

  // Typed-in text is not a text node, so read the controls themselves.
  const skipTypes = new Set(["hidden", "checkbox", "radio", "range", "color", "file", "button", "submit", "reset", "image"]);
  for (const control of document.querySelectorAll("input, textarea, select")) {
    if (skipTypes.has(control.type)) continue;
    const box = control.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0 || visuallyHidden(control)) continue;
    const shown = control.tagName === "SELECT" ? (control.options[control.selectedIndex]?.text ?? "") : control.value || control.placeholder || "";
    if (shown.trim()) found.push(record(control, shown.trim(), "control"));
  }
  return found;
}

// ----------------------------------------------------------------- the checks

const isPriceFigure = (text) => /^\$\s?\d[\d,]*(\.\d{2})?$/.test(text);

function fonts(item, adminRoute) {
  if (!/fraunces/i.test(item.family)) return true;
  if (isPriceFigure(item.text)) return true;
  return !adminRoute && item.inHeading && !item.inDayName;
}

const pct = (part, whole) => (whole === 0 ? 0 : (part / whole) * 100);
const fmt = (n) => n.toLocaleString("en-US");

async function main() {
  const routes = await routesFromBuild();
  const server = process.env.BASE_URL ? { base: process.env.BASE_URL.replace(/\/$/, ""), stop() {} } : await startServer();
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const context = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await context.newPage();

  const rows = [];
  const seenLinks = new Set();
  const problems = [];

  async function open(urlPath) {
    const response = await page.goto(server.base + urlPath, { waitUntil: "load" });
    // Let hydration and link prefetching settle, but never wait on a prefetch
    // that stays open: the text is already on the page.
    await page.waitForLoadState("networkidle", { timeout: 2000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    return response;
  }

  async function walk(label, urlPath, adminRoute, items) {
    const total = items.reduce((n, i) => n + i.chars, 0);
    const under16 = items.filter((i) => i.size < READABLE_PX);
    const under16Chars = under16.reduce((n, i) => n + i.chars, 0);
    const belowFloor = items.filter((i) => i.size < FLOOR_PX);
    const wrongFont = items.filter((i) => !fonts(i, adminRoute));
    rows.push({ label, path: urlPath, nodes: items.length, chars: total, under16Chars, pctUnder16: pct(under16Chars, total), belowFloor, wrongFont, under16 });
  }

  try {
    for (const route of routes) {
      let urlPath = route;
      if (route === NOT_FOUND_ROUTE) urlPath = NOT_FOUND_URL;
      if (route.includes("[")) {
        const pattern = new RegExp(`^${route.replace(/\[[^\]]+\]/g, "[^/?#]+")}$`);
        urlPath = [...seenLinks].find((href) => pattern.test(href));
        if (!urlPath) {
          problems.push(`${route}: no link to a real page of this kind was found on the pages walked before it`);
          continue;
        }
      }

      const response = await open(urlPath);
      const finalPath = new URL(page.url()).pathname;
      if (finalPath !== urlPath && route !== NOT_FOUND_ROUTE) {
        console.log(`  ${route} redirects to ${finalPath}; measured there`);
        continue;
      }
      if (route === NOT_FOUND_ROUTE && response.status() !== 404) problems.push(`${NOT_FOUND_URL} answered ${response.status()}, expected 404`);
      for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href").split("#")[0]))) seenLinks.add(href);

      const adminRoute = route.startsWith("/admin-preview");
      const label = route === NOT_FOUND_ROUTE ? "(404 page)" : urlPath;
      await walk(label, urlPath, adminRoute, await page.evaluate(measurePage));

      for (const state of STATES[route] ?? []) {
        await open(urlPath);
        await state.run(page);
        await walk(`${label} [${state.name}]`, urlPath, adminRoute, await page.evaluate(measurePage));
      }
    }
  } finally {
    await browser.close();
    server.stop();
  }

  // ------------------------------------------------------------------ report
  const width = Math.max(...rows.map((r) => r.label.length), 5) + 2;
  console.log(`\nType check at ${VIEWPORT.width}px  (floor ${FLOOR_PX}px, readable ${READABLE_PX}px, target < ${TARGET_PCT}% of characters under ${READABLE_PX}px)\n`);
  console.log(`${"page".padEnd(width)}${"nodes".padStart(6)}${"chars".padStart(8)}${`<${FLOOR_PX}px`.padStart(7)}${`<${READABLE_PX}px chars`.padStart(12)}${`% <${READABLE_PX}px`.padStart(10)}  `);
  for (const r of rows) {
    const flag = r.belowFloor.length ? "FAIL" : r.pctUnder16 >= TARGET_PCT ? "over target" : "ok";
    console.log(
      `${r.label.padEnd(width)}${fmt(r.nodes).padStart(6)}${fmt(r.chars).padStart(8)}${String(r.belowFloor.length).padStart(7)}${fmt(r.under16Chars).padStart(12)}${`${r.pctUnder16.toFixed(1)}%`.padStart(10)}  ${flag}`,
    );
  }

  const floorFails = rows.flatMap((r) => r.belowFloor.map((i) => ({ page: r.label, ...i })));
  const fontFails = rows.flatMap((r) => r.wrongFont.map((i) => ({ page: r.label, ...i })));
  const overTarget = rows.filter((r) => r.chars > 0 && r.pctUnder16 >= TARGET_PCT);

  const show = (list, detail, limit = 25) => {
    list.slice(0, limit).forEach((i) => console.log(`    ${i.page}  ${detail(i)}  "${i.text}"  ${i.path}`));
    if (list.length > limit) console.log(`    ... and ${list.length - limit} more`);
  };

  console.log(`\nFloor, nothing under ${FLOOR_PX}px: ${floorFails.length ? `FAIL (${floorFails.length} text nodes)` : "pass"}`);
  show(floorFails, (i) => `${i.size}px`);
  console.log(`Fonts, Fraunces only on h1, section h2 and price figures: ${fontFails.length ? `FAIL (${fontFails.length} text nodes)` : "pass"}`);
  show(fontFails, (i) => `Fraunces ${i.weight}`);
  console.log(`Target, under ${TARGET_PCT}% of characters below ${READABLE_PX}px on every page: ${overTarget.length ? `${overTarget.length} page(s) over${STRICT ? " (FAIL, --strict)" : " (reported, not failing)"}` : "pass"}`);
  if (problems.length) console.log(`Problems:\n${problems.map((p) => `    ${p}`).join("\n")}`);

  if (VERBOSE) {
    for (const r of rows) {
      const bySnippet = new Map();
      for (const i of r.under16) {
        const key = `${i.size}px  ${i.path}`;
        const entry = bySnippet.get(key) ?? { chars: 0, sample: i.text };
        entry.chars += i.chars;
        bySnippet.set(key, entry);
      }
      const top = [...bySnippet.entries()].sort((a, b) => b[1].chars - a[1].chars).slice(0, 8);
      if (!top.length) continue;
      console.log(`\n  ${r.label}: biggest sub-${READABLE_PX}px text`);
      for (const [key, { chars, sample }] of top) console.log(`    ${String(chars).padStart(5)} chars  ${key}  "${sample}"`);
    }
  }

  if (JSON_OUT) {
    const slim = rows.map((r) => ({
      label: r.label,
      path: r.path,
      nodes: r.nodes,
      chars: r.chars,
      under16Chars: r.under16Chars,
      pctUnder16: r.pctUnder16,
      belowFloor: r.belowFloor.map(({ text, size, path: p }) => ({ text, size, path: p })),
      wrongFont: r.wrongFont.map(({ text, weight, path: p }) => ({ text, weight, path: p })),
    }));
    await writeFile(JSON_OUT, JSON.stringify({ viewport: VIEWPORT, rows: slim, problems }, null, 2));
  }

  const failed = floorFails.length > 0 || fontFails.length > 0 || problems.length > 0 || (STRICT && overTarget.length > 0);
  console.log(failed ? "\nFAILED" : "\nPASSED");
  process.exitCode = failed ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 2;
});
