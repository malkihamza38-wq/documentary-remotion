import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
}

export const OutroScene: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 22 }, durationInFrames: 50 });
  const fadeOut = interpolate(frame, [durationInFrames - 40, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const lineGrow = interpolate(frame, [20, 80], [0, 600], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: fadeOut,
      }}
    >
      {/* Horizontal line */}
      <div
        style={{
          width: lineGrow,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />

      {/* Main outro text */}
      <div
        style={{
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
          fontFamily: 'Georgia, serif',
          fontSize: 52,
          color: '#ffffff',
          letterSpacing: 6,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {text}
      </div>

      {/* Horizontal line */}
      <div
        style={{
          width: lineGrow,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />

      {/* Small logo/credit area */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          opacity: interpolate(frame, [60, 100], [0, 1], { extrapolateRight: 'clamp' }) * fadeOut,
          fontFamily: 'monospace',
          fontSize: 14,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        Made with Remotion
      </div>
    </AbsoluteFill>
  );
};
