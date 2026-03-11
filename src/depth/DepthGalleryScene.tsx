import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { BlobBackground } from './components/BlobBackground';
import { GalleryPlane } from './components/GalleryPlane';
import { Trail } from './components/Trail';
import { ColorLabel } from './components/ColorLabel';
import { galleryData } from './data/galleryData';

// Spacing between planes in Z
const Z_GAP = 3.5;
// Frames spent "on" each plane
const FRAMES_PER_PLANE = 90;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Inner component that uses useLoader (must be inside Canvas)
const GalleryScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const totalFrames = galleryData.length * FRAMES_PER_PLANE;
  const globalProgress = Math.min(frame / totalFrames, 1);

  // Camera Z: moves from 0 forward through negative Z
  const totalDepth = (galleryData.length - 1) * Z_GAP;
  const cameraZ = -globalProgress * totalDepth;

  // Scroll velocity (derivative of cameraZ, estimated)
  const prevProgress = Math.max(0, (frame - 1) / totalFrames);
  const velocity = (globalProgress - prevProgress) * totalDepth * fps;

  // Breath animation
  const timeInSeconds = frame / fps;
  const breathAmount = Math.sin(timeInSeconds * 1.8) * 0.5 + 0.5; // 0-1

  // Parallax oscillation
  const parallaxX = Math.sin(timeInSeconds * 0.4) * 0.3;
  const parallaxY = Math.cos(timeInSeconds * 0.3) * 0.15;

  // Which plane are we closest to?
  const currentPlaneIndex = Math.floor(globalProgress * galleryData.length);
  const clampedIdx = Math.min(currentPlaneIndex, galleryData.length - 1);
  const nextIdx = Math.min(clampedIdx + 1, galleryData.length - 1);
  const blendProgress = (globalProgress * galleryData.length) % 1;

  // Load textures
  const textures = useLoader(
    THREE.TextureLoader,
    galleryData.map((d) => d.imageUrl)
  );

  // Plane positions and opacities
  const planes = useMemo(() => {
    return galleryData.map((item, i) => {
      const planeZ = -i * Z_GAP;
      const distFromCamera = Math.abs(cameraZ - planeZ);
      const maxVisible = Z_GAP * 1.5;
      const opacity = 1 - smoothstep(0, maxVisible, distFromCamera);

      // Slight horizontal offset for depth perception
      const xOffset = i % 2 === 0 ? 0.1 : -0.1;

      return { item, planeZ, opacity, xOffset };
    });
  }, [cameraZ]);

  return (
    <>
      {/* Camera */}
      <perspectiveCamera
        makeDefault
        position={[0, 0, cameraZ + 5]}
        fov={45}
        near={0.1}
        far={100}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={0.8} />

      {/* Background quad (renders behind everything) */}
      <BlobBackground
        currentItem={galleryData[clampedIdx]}
        nextItem={galleryData[nextIdx]}
        blendProgress={blendProgress}
        velocity={velocity}
        timeInSeconds={timeInSeconds}
      />

      {/* Gallery planes */}
      {planes.map(({ item, planeZ, opacity, xOffset }, i) => (
        <GalleryPlane
          key={item.id}
          item={item}
          texture={textures[i] as THREE.Texture}
          position={[xOffset, 0, planeZ]}
          opacity={opacity}
          breath={breathAmount}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          width={3.2}
          height={2.0}
        />
      ))}

      {/* Glowing trail */}
      <Trail
        cameraZ={cameraZ + 5}
        scrollProgress={globalProgress}
        velocity={velocity}
        timeInSeconds={timeInSeconds}
        totalDepth={totalDepth}
      />
    </>
  );
};

interface Props {
  images?: string[]; // Optional override for plane images
}

export const DepthGalleryScene: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const totalFrames = galleryData.length * FRAMES_PER_PLANE;
  const globalProgress = Math.min(frame / totalFrames, 1);
  const currentIdx = Math.min(
    Math.floor(globalProgress * galleryData.length),
    galleryData.length - 1
  );

  // Local frame for label entrance (resets per plane)
  const localFrame = frame % FRAMES_PER_PLANE;

  return (
    <div style={{ width, height, position: 'relative', background: '#000' }}>
      {/* Three.js canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        orthographic={false}
      >
        <GalleryScene frame={frame} fps={fps} />
      </ThreeCanvas>

      {/* HTML overlay: color label */}
      <ColorLabel
        item={galleryData[currentIdx]}
        index={currentIdx}
        total={galleryData.length}
        frame={localFrame}
      />

      {/* Cinematic bars */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
};
