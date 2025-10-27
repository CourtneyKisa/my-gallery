export default function SeoMe() {
  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || '';
  if (!username) return null;
  return <link rel="me" href={`https://instagram.com/${username}`} />;
}
