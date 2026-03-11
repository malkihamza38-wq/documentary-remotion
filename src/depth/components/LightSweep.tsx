import React from 'react';
import { useCurrentFrame } from 'remotion';

interface LightSweepProps {
  /** Durée d'une boucle complète en frames (défaut : 150) */
  loopFrames?: number;
  /** Angle de la ligne en degrés (défaut : -25) */
  angle?: number;
  /** Couleur principale RGB (défaut : violet) */
  color?: string;
  /** Opacité globale 0-1 (défaut : 1) */
  opacity?: number;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  loopFrames = 150,
  angle = -25,
  color = '180, 60, 255',
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  // t : 0 → 1 en boucle, avec easing sinusoïdal pour accélération/décélération
  const tRaw = (frame % loopFrames) / loopFrames;
  // Ease in-out: accélère au milieu, lent au début et à la fin
  const t = 0.5 - 0.5 * Math.cos(tRaw * Math.PI * 2);

  // X sweep : de -40% à 140% (sort des deux côtés)
  const x = -40 + t * 180;

  // Fade-in/out sur les bords de la boucle pour éviter le saut
  const edgeFade = Math.sin(tRaw * Math.PI); // 0→1→0 sur la boucle

  const finalOpacity = opacity * edgeFade;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* ── Glow diffus large (halo ambiant) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${x}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: 900,
          height: 500,
          background: `radial-gradient(ellipse, rgba(${color}, 0.2) 0%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: finalOpacity,
        }}
      />

      {/* ── Halo intermédiaire */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${x}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: 750,
          height: 60,
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(${color}, 0.35) 25%,
            rgba(${color}, 0.55) 50%,
            rgba(${color}, 0.35) 75%,
            transparent 100%
          )`,
          filter: 'blur(10px)',
          opacity: finalOpacity,
        }}
      />

      {/* ── Ligne core (fine et brillante) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${x}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: 800,
          height: 3,
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(${color}, 0.7) 20%,
            rgba(255, 230, 255, 1.0) 50%,
            rgba(${color}, 0.7) 80%,
            transparent 100%
          )`,
          filter: 'blur(0.5px)',
          opacity: finalOpacity,
        }}
      />

      {/* ── Micro éclat au centre du rayon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${x}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: 80,
          height: 80,
          background: `radial-gradient(circle, rgba(255,240,255,0.9) 0%, transparent 70%)`,
          filter: 'blur(4px)',
          opacity: finalOpacity * 0.8,
        }}
      />
    </div>
  );
};
