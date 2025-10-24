export const getInstagramUrl = () => {
  const u = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || '';
  return u ? `https://instagram.com/${u}` : 'https://instagram.com';
};
