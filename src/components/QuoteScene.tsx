import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
  author: string;
}

export const QuoteScene: React.FC<Props> = ({ text, author }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 25 }, durationInFrames: 50 });
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const quoteMarkSize = interpolate(progress, [0, 1], [0, 120]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 180px',
        opacity: fadeOut,
      }}
    >
      {/* Left border accent */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 4,
          height: interpolate(progress, [0, 1], [0, 300], { extrapolateRight: 'clamp' }),
          background: 'linear-gradient(180deg, transparent, #c9a84c, transparent)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, opacity: progress }}>
        {/* Quote mark */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: quoteMarkSize,
            color: '#c9a84c',
            lineHeight: 0.5,
            opacity: 0.4,
          }}
        >
          "
        </div>

        {/* Quote text */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            color: '#f0e8d0',
            fontStyle: 'italic',
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          {text}
        </div>

        {/* Author */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 22,
            color: '#c9a84c',
            letterSpacing: 3,
            textAlign: 'right',
          }}
        >
          {author}
        </div>
      </div>
    </AbsoluteFill>
  );
};
