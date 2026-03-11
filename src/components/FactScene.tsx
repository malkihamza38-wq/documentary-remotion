import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
}

export const FactScene: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 20 }, durationInFrames: 40 });
  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const scanWidth = interpolate(frame, [0, 60], [0, 1920], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Scan line effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: scanWidth,
          height: '100%',
          background: 'linear-gradient(90deg, transparent 95%, rgba(0,200,150,0.08) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 10}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: '#00c896',
            }}
          />
        ))}
      </div>

      {/* Tag */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 120,
          opacity: progress,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#00c896',
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        [ FACT ]
      </div>

      {/* Fact text */}
      <div
        style={{
          opacity: progress,
          transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
          fontFamily: 'Georgia, serif',
          fontSize: 48,
          color: '#ffffff',
          textAlign: 'center',
          maxWidth: 1400,
          lineHeight: 1.5,
          padding: '0 120px',
          textShadow: '0 0 40px rgba(0,200,150,0.3)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
