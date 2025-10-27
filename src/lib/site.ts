export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/+$/, '');

  return 'http://localhost:3000';
};

export const getInstagramUrl = (): string => {
  const u = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || '';
  return u ? `https://instagram.com/${u}` : 'https://instagram.com';
};
