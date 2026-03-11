import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text: string;
}

export const NarrationScene: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Ken Burns effect - slow zoom + slight pan
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  const translateX = interpolate(frame, [0, durationInFrames], [0, -20]);

  // Typewriter reveal for the text
  const charsToShow = Math.floor(interpolate(frame, [10, 100], [0, text.length], { extrapolateRight: 'clamp' }));
  const visibleText = text.slice(0, charsToShow);

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        overflow: 'hidden',
        opacity,
      }}
    >
      {/* Cinematic background texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translateX(${translateX}px)`,
          background: 'radial-gradient(ellipse at 30% 60%, #0f1923 0%, #000 70%)',
        }}
      />

      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.15,
        }}
      />

      {/* Bottom gradient for text */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        }}
      />

      {/* Narration text */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 150,
          right: 150,
          fontFamily: 'Georgia, serif',
          fontSize: 34,
          color: '#e8e0d0',
          lineHeight: 1.8,
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)',
        }}
      >
        {visibleText}
        {charsToShow < text.length && (
          <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: '#c9a84c' }}>|</span>
        )}
      </div>

      {/* Cinematic bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: '#000' }} />
    </AbsoluteFill>
  );
};
