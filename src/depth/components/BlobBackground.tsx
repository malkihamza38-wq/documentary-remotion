import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { GalleryItem } from '../data/galleryData';

// Inline GLSL strings (Vite GLSL plugin not available in Remotion by default)
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uBackgroundColor;
uniform vec3 uBlob1Color;
uniform vec3 uBlob2Color;
uniform float uBlobRadius;
uniform float uBlobStrength;
uniform float uVelocity;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float deform = abs(uVelocity) * 0.12;
  uv.y += sin(uv.x * 3.0 + uTime * 0.5) * deform;
  uv.x += cos(uv.y * 2.0 + uTime * 0.3) * deform * 0.5;

  vec2 blob1Center = vec2(
    0.28 + sin(uTime * 0.4) * 0.12,
    0.38 + cos(uTime * 0.3) * 0.14
  );
  vec2 blob2Center = vec2(
    0.72 + cos(uTime * 0.35 + 1.2) * 0.1,
    0.62 + sin(uTime * 0.45 + 0.8) * 0.12
  );

  vec2 aspect = vec2(1.7778, 1.0);
  float d1 = length((uv - blob1Center) * aspect);
  float d2 = length((uv - blob2Center) * aspect);

  float r = uBlobRadius + abs(uVelocity) * 0.08;
  float blob1 = smoothstep(r + 0.25, r - 0.05, d1) * uBlobStrength;
  float blob2 = smoothstep(r + 0.2, r - 0.05, d2) * uBlobStrength;

  float grain = (rand(uv + fract(uTime * 0.1)) - 0.5) * 0.025;

  vec3 color = uBackgroundColor;
  color = mix(color, uBlob1Color, blob1);
  color = mix(color, uBlob2Color, blob2);

  float vignette = 1.0 - length((uv - 0.5) * 1.2);
  color += clamp(vignette, 0.0, 1.0) * 0.04;
  color += grain;
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface Props {
  currentItem: GalleryItem;
  nextItem: GalleryItem | null;
  blendProgress: number; // 0-1 between currentItem and nextItem
  velocity: number;
  timeInSeconds: number;
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): THREE.Color {
  return new THREE.Color(
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  );
}

export const BlobBackground: React.FC<Props> = ({
  currentItem,
  nextItem,
  blendProgress,
  velocity,
  timeInSeconds,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBackgroundColor: { value: new THREE.Color(...currentItem.backgroundColor) },
      uBlob1Color: { value: new THREE.Color(...currentItem.blob1Color) },
      uBlob2Color: { value: new THREE.Color(...currentItem.blob2Color) },
      uBlobRadius: { value: 0.28 },
      uBlobStrength: { value: 0.85 },
      uVelocity: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Update uniforms each frame — in Remotion useFrame drives deterministic render
  useFrame(() => {
    uniforms.uTime.value = timeInSeconds;
    uniforms.uVelocity.value = velocity;

    const t = blendProgress;
    const next = nextItem ?? currentItem;

    uniforms.uBackgroundColor.value = lerpColor(currentItem.backgroundColor, next.backgroundColor, t);
    uniforms.uBlob1Color.value = lerpColor(currentItem.blob1Color, next.blob1Color, t);
    uniforms.uBlob2Color.value = lerpColor(currentItem.blob2Color, next.blob2Color, t);
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};
