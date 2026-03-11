import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  value: string;
  unit: string;
  label: string;
}

export const StatScene: React.FC<Props> = ({ value, unit, label }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 60 });
  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const numericValue = parseFloat(value);
  const animatedValue = interpolate(progress, [0, 1], [0, numericValue]);
  const displayValue = Number.isInteger(numericValue)
    ? Math.round(animatedValue).toString()
    : animatedValue.toFixed(1);

  const circleRadius = interpolate(progress, [0, 1], [0, 220]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0a0a1a 0%, #000 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Circle accent */}
      <div
        style={{
          position: 'absolute',
          width: circleRadius * 2,
          height: circleRadius * 2,
          borderRadius: '50%',
          border: '1px solid rgba(100,150,255,0.15)',
          background: 'radial-gradient(circle, rgba(100,150,255,0.05) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: circleRadius * 2 * 0.7,
          height: circleRadius * 2 * 0.7,
          borderRadius: '50%',
          border: '1px solid rgba(100,150,255,0.08)',
        }}
      />

      {/* Value */}
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 160,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
          textShadow: '0 0 80px rgba(100,150,255,0.5)',
          opacity: progress,
        }}
      >
        {displayValue}
      </div>

      {/* Unit */}
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 32,
          color: '#6496ff',
          letterSpacing: 4,
          marginTop: 8,
          opacity: progress,
          textTransform: 'uppercase',
        }}
      >
        {unit}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 6,
          marginTop: 24,
          textTransform: 'uppercase',
          opacity: progress,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
