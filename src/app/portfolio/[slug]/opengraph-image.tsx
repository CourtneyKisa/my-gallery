import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '../../../lib/projects';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  const title = project?.title || 'Portfolio Project';
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Courtney Kisa';

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
          background: 'linear-gradient(135deg,#111827 0%,#1f2937 100%)',
          color: 'white',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 12 }}>{site}</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textShadow: '0 8px 30px rgba(0,0,0,0.35)',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {project?.tags?.length ? (
          <div style={{ marginTop: 18, fontSize: 28, opacity: 0.9 }}>
            {project.tags.slice(0, 4).join(' • ')}
          </div>
        ) : null}
      </div>
    ),
    { ...size }
  );
}
