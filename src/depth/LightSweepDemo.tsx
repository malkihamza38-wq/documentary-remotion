import React from 'react';
import { useVideoConfig } from 'remotion';
import { LightSweep } from './components/LightSweep';

/**
 * Composition de démonstration de l'effet light sweep.
 * Fond noir + grille + deux rayons lumineux en boucle décalée.
 */
export const LightSweepDemo: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ width, height, position: 'relative', background: '#0a0008', overflow: 'hidden' }}>

      {/* Grille de fond en perspective */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        backgroundPosition: 'center center',
        transform: 'perspective(1000px) rotateX(35deg) scaleY(1.8)',
        transformOrigin: 'center 65%',
      }} />

      {/* Rayon principal violet */}
      <LightSweep
        loopFrames={150}
        angle={-25}
        color="180, 60, 255"
        opacity={0.9}
      />

      {/* Second rayon décalé (démarre à mi-boucle) pour donner de la richesse */}
      <LightSweep
        loopFrames={150}
        angle={-18}
        color="220, 80, 255"
        opacity={0.45}
      />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)',
      }} />
    </div>
  );
};
