import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { GalleryItem } from '../data/galleryData';

const vertexShader = `
uniform float uBreath;
uniform float uParallaxX;
uniform float uParallaxY;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  pos.x *= 1.0 + uBreath * 0.04;
  pos.y *= 1.0 + uBreath * 0.04;
  pos.x += uParallaxX * 0.3;
  pos.y += uParallaxY * 0.15;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);
  vec2 centered = vUv - 0.5;
  float vignette = 1.0 - dot(centered * 1.6, centered * 1.6);
  vignette = clamp(pow(clamp(vignette, 0.0, 1.0), 0.4), 0.0, 1.0);
  gl_FragColor = vec4(tex.rgb * vignette, tex.a * uOpacity);
}
`;

interface Props {
  item: GalleryItem;
  texture: THREE.Texture | null;
  position: [number, number, number];
  opacity: number;
  breath: number;
  parallaxX: number;
  parallaxY: number;
  width: number;
  height: number;
}

export const GalleryPlane: React.FC<Props> = ({
  texture,
  position,
  opacity,
  breath,
  parallaxX,
  parallaxY,
  width,
  height,
}) => {
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture ?? new THREE.Texture() },
      uOpacity: { value: opacity },
      uBreath: { value: breath },
      uParallaxX: { value: parallaxX },
      uParallaxY: { value: parallaxY },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texture]
  );

  // Update per render (Remotion drives this deterministically)
  uniforms.uOpacity.value = opacity;
  uniforms.uBreath.value = breath;
  uniforms.uParallaxX.value = parallaxX;
  uniforms.uParallaxY.value = parallaxY;
  if (texture) uniforms.uTexture.value = texture;

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
