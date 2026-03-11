import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';
import type { GalleryItem } from '../data/galleryData';

interface Props {
  item: GalleryItem;
  index: number;
  total: number;
  frame: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  if (k === 1) return [0, 0, 0, 100];
  const c = Math.round(((1 - rf - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gf - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bf - k) / (1 - k)) * 100);
  return [c, m, y, Math.round(k * 100)];
}

export const ColorLabel: React.FC<Props> = ({ item, index, total, frame }) => {
  const { fps } = useVideoConfig();
  const entryProgress = spring({ frame, fps, config: { damping: 25 }, durationInFrames: 45 });
  const [r, g, b] = hexToRgb(item.hex);
  const [c, m, y, k] = rgbToCmyk(r, g, b);

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 80,
    left: 120,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    opacity: entryProgress,
    transform: `translateX(${interpolate(entryProgress, [0, 1], [-20, 0])}px)`,
  };

  const monoStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={labelStyle}>
        {/* Index */}
        <div style={{ ...monoStyle, color: 'rgba(255,255,255,0.3)' }}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* Color name */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 42,
            color: '#ffffff',
            letterSpacing: 3,
            fontStyle: 'italic',
          }}
        >
          {item.label}
        </div>

        {/* Color chip */}
        <div
          style={{
            width: 48,
            height: 6,
            borderRadius: 3,
            background: item.hex,
            boxShadow: `0 0 12px ${item.hex}88`,
          }}
        />

        {/* Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={monoStyle}>{item.pms}</div>
          <div style={monoStyle}>{item.hex.toUpperCase()}</div>
          <div style={monoStyle}>
            RGB {r} {g} {b}
          </div>
          <div style={monoStyle}>
            CMYK {c} {m} {y} {k}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
