import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
  subtitle: string;
}

export const TitleScene: React.FC<Props> = ({ text, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 20 }, durationInFrames: 40 });
  const titleY = interpolate(titleOpacity, [0, 1], [40, 0]);

  const subtitleOpacity = spring({ frame: frame - 20, fps, config: { damping: 20 }, durationInFrames: 40 });
  const subtitleY = interpolate(subtitleOpacity, [0, 1], [20, 0]);

  const lineWidth = interpolate(frame, [30, 80], [0, 300], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* Stars background */}
      <Stars />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: 'Georgia, serif',
          fontSize: 82,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: 4,
          textTransform: 'uppercase',
          textShadow: '0 0 60px rgba(100,150,255,0.6)',
          maxWidth: 1400,
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>

      {/* Separator line */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #6496ff, transparent)',
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: 'Georgia, serif',
          fontSize: 28,
          color: '#a0b4ff',
          letterSpacing: 8,
          textTransform: 'uppercase',
          fontStyle: 'italic',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

const Stars: React.FC = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: (i * 137.508) % 100,
    y: (i * 97.3) % 100,
    size: (i % 3) + 1,
    opacity: 0.3 + (i % 5) * 0.14,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
};
