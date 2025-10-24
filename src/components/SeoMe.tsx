export default function SeoMe() {
  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || '';
  if (!username) return null;
  const href = `https://instagram.com/${username}`;
  return <link rel="me" href={href} />;
}
