import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  number: number;
  text: string;
}

export const ChapterScene: React.FC<Props> = ({ number, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 50 });
  const numProgress = spring({ frame: frame - 10, fps, config: { damping: 20 }, durationInFrames: 45 });
  const textProgress = spring({ frame: frame - 25, fps, config: { damping: 22 }, durationInFrames: 45 });

  const lineScale = interpolate(progress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 200,
      }}
    >
      {/* Vertical accent line */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: '15%',
          width: 3,
          height: `${lineScale * 70}%`,
          background: 'linear-gradient(180deg, #e63946, #c1121f)',
        }}
      />

      {/* Chapter label */}
      <div
        style={{
          opacity: progress,
          fontFamily: 'monospace',
          fontSize: 16,
          color: '#e63946',
          letterSpacing: 8,
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        Chapitre
      </div>

      {/* Chapter number */}
      <div
        style={{
          opacity: numProgress,
          transform: `translateX(${interpolate(numProgress, [0, 1], [-60, 0])}px)`,
          fontFamily: 'Georgia, serif',
          fontSize: 180,
          fontWeight: 700,
          color: 'rgba(230,57,70,0.15)',
          lineHeight: 0.85,
          position: 'relative',
        }}
      >
        {String(number).padStart(2, '0')}
      </div>

      {/* Chapter title */}
      <div
        style={{
          opacity: textProgress,
          transform: `translateY(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
          fontFamily: 'Georgia, serif',
          fontSize: 64,
          color: '#ffffff',
          letterSpacing: 2,
          marginTop: -30,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
