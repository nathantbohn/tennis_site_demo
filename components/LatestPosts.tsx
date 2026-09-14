import type { Post, SiteInfo } from "@/data/types";
import { formatDateTime } from "@/lib/format";
import { socialFollowLabel } from "@/lib/social";
import { Container } from "@/components/Container";
import { ExternalIcon } from "@/components/Icons";
import { Placeholder } from "@/components/Placeholder";
import { SectionHeading } from "@/components/SectionHeading";

const aspects = ["aspect-[4/5]", "aspect-square", "aspect-[4/5]"];

/**
 * "Latest" from the club. Phase 1 renders sample posts from /data; Phase 2
 * fills the same shape from whichever social platform is set up by then
 * (see the `todo` on site.social in data/site.json — there's no Instagram
 * account yet). Horizontal snap scroll on phones, a staggered three-up on
 * wider screens.
 *
 * The follow link uses whatever the first entry in `site.social` is —
 * never hardcoded to a specific platform — so it just stops rendering if
 * the array is ever empty, and picks up a new platform automatically.
 */
export function LatestPosts({ posts, site }: { posts: Post[]; site: SiteInfo }) {
  const follow = site.social[0];
  return (
    <section aria-labelledby="latest-heading" className="py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Latest" id="latest-heading" title="From the courts this month" />
          {follow ? (
            <a
              href={follow.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-medium text-slate-800 underline decoration-aqua-200 underline-offset-4 hover:decoration-slate-800"
            >
              {socialFollowLabel(follow)}
              <ExternalIcon />
            </a>
          ) : null}
        </div>

        {/*
          tabIndex makes the scroll strip itself reachable by keyboard (axe:
          scrollable-region-focusable) — it only actually scrolls below the
          sm breakpoint, where overflow-x-auto is active; at sm and up the
          layout is a non-scrolling grid, so the extra tab stop there is a
          harmless no-op rather than a real keyboard trap.
        */}
        <ul
          tabIndex={0}
          aria-label="Latest posts, scroll for more"
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0"
        >
          {posts.map((post, i) => (
            <li key={post.id} className="w-[76%] shrink-0 snap-start sm:w-auto">
              <article className={i === 1 ? "sm:pt-10" : ""}>
                <Placeholder image={post.image} className={`${aspects[i % aspects.length]} rounded-2xl`} />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
                  {post.source === "instagram" ? " · Instagram" : null}
                </p>
                <p className="mt-2 leading-relaxed">{post.body}</p>
                {post.permalink ? (
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-slate-800 underline decoration-aqua-200 underline-offset-4 hover:decoration-slate-800"
                  >
                    View post
                    <ExternalIcon className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
