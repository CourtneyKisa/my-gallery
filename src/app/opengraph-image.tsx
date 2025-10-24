import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Courtney Kisa';
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Portfolio & Blog';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background:
            'linear-gradient(135deg, #0ea5e9 0%, #6366f1 30%, #8b5cf6 60%, #ec4899 100%)',
          color: 'white',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textShadow: '0 8px 30px rgba(0,0,0,0.35)',
          }}
        >
          {site}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            opacity: 0.95,
            textShadow: '0 6px 20px rgba(0,0,0,0.35)',
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 6,
            width: 220,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.85)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
