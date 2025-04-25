import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AquaList - Discord Bot Directory'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #10b981, #0ea5e9)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <img
            src="imh.png"
            alt="AquaList Logo"
            width={80}
            height={80}
            style={{
              marginRight: '24px',
            }}
          />
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            AquaList
          </h1>
        </div>
        <p
          style={{
            fontSize: '32px',
            color: 'white',
            opacity: 0.9,
            textAlign: 'center',
            margin: 0,
            marginBottom: '32px',
          }}
        >
          The Ultimate Discord Bot Directory
        </p>
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {['Verified Bots', 'Active Community', '24/7 Support'].map((feature) => (
            <div
              key={feature}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '12px',
                color: 'white',
                fontSize: '24px',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 