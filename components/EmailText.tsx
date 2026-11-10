/**
 * An email address that may wrap just before the "@" when its box is too
 * narrow, but never inside the name or the domain. `break-all` would split
 * "delandtennisclub@gmail.com" anywhere, which makes it hard to read aloud or
 * retype. The text content is unchanged, so copy and paste still work.
 */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at < 0) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}
