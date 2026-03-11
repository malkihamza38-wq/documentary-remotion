import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TrailPoint {
  x: number;
  y: number;
  z: number;
}

function buildTubeGeometry(points: TrailPoint[], tubeRadius: number, radialSegments: number): THREE.BufferGeometry {
  if (points.length < 2) return new THREE.BufferGeometry();

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Compute tangents via finite differences
  const tangents: THREE.Vector3[] = points.map((p, i) => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    return new THREE.Vector3(next.x - prev.x, next.y - prev.y, next.z - prev.z).normalize();
  });

  // Compute normals using rotation minimizing frames
  const frames: { N: THREE.Vector3; B: THREE.Vector3 }[] = [];
  const initN = new THREE.Vector3(0, 1, 0);
  if (Math.abs(tangents[0].dot(initN)) > 0.99) initN.set(1, 0, 0);
  let N = initN.clone().sub(tangents[0].clone().multiplyScalar(tangents[0].dot(initN))).normalize();

  for (let i = 0; i < tangents.length; i++) {
    const B = new THREE.Vector3().crossVectors(tangents[i], N).normalize();
    N = new THREE.Vector3().crossVectors(B, tangents[i]).normalize();
    frames.push({ N: N.clone(), B: B.clone() });

    // Propagate to next
    if (i < tangents.length - 1) {
      const axis = new THREE.Vector3().crossVectors(tangents[i], tangents[i + 1]);
      if (axis.length() > 1e-6) {
        const angle = Math.acos(Math.min(1, tangents[i].dot(tangents[i + 1])));
        const q = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), angle);
        N.applyQuaternion(q);
      }
    }
  }

  // Build vertices
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const { N: fn, B: fb } = frames[i];
    // Taper radius: full at tail, 0 at head
    const t = i / (points.length - 1);
    const r = tubeRadius * t; // tail is full, head tapers to 0

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const nx = fn.x * cos + fb.x * sin;
      const ny = fn.y * cos + fb.y * sin;
      const nz = fn.z * cos + fb.z * sin;
      positions.push(p.x + nx * r, p.y + ny * r, p.z + nz * r);
      normals.push(nx, ny, nz);
      uvs.push(j / radialSegments, t);
    }
  }

  // Build indices
  const stride = radialSegments + 1;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = a + stride;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

interface Props {
  cameraZ: number;
  scrollProgress: number; // 0 to 1 through the whole gallery
  velocity: number;
  timeInSeconds: number;
  totalDepth: number;
}

export const Trail: React.FC<Props> = ({
  cameraZ,
  scrollProgress,
  velocity,
  timeInSeconds,
  totalDepth,
}) => {
  const TUBE_RADIUS = 0.025;
  const RADIAL_SEGMENTS = 8;
  const TRAIL_POINTS = 80;

  const { geometry, material } = useMemo(() => {
    const points: TrailPoint[] = [];

    for (let i = 0; i < TRAIL_POINTS; i++) {
      const t = i / (TRAIL_POINTS - 1); // 0 = head, 1 = tail

      // Trail extends behind camera (positive Z = behind in -Z camera)
      const z = cameraZ + t * Math.min(totalDepth * 0.4, 8);

      // Undulation based on time + position along trail
      const wave = Math.sin(timeInSeconds * 1.2 + t * Math.PI * 3) * 0.15 * (1 - t * 0.5);
      const waveY = Math.cos(timeInSeconds * 0.8 + t * Math.PI * 2) * 0.07 * (1 - t * 0.3);

      // Velocity makes the trail whip
      const velOffset = velocity * 0.3 * t;

      points.push({
        x: -0.8 + wave + velOffset,
        y: 0.1 + waveY,
        z,
      });
    }

    const geo = buildTubeGeometry(points, TUBE_RADIUS, RADIAL_SEGMENTS);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f6f9ff'),
      emissive: new THREE.Color('#7fd5ff'),
      emissiveIntensity: 1.35,
      transparent: true,
      opacity: Math.min(1, 0.4 + scrollProgress * 0.6),
      roughness: 0.3,
      metalness: 0.1,
    });

    return { geometry: geo, material: mat };
  }, [cameraZ, scrollProgress, velocity, timeInSeconds, totalDepth]);

  return (
    <>
      {/* Trail mesh */}
      <mesh geometry={geometry} material={material} />

      {/* Ambient glow lights */}
      <pointLight
        position={[-0.8, 0.1, cameraZ]}
        color="#7fd5ff"
        intensity={0.8}
        distance={3}
        decay={2}
      />

      {/* Head particle glow */}
      <mesh position={[-0.8, 0.1, cameraZ]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#aaeeff"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
};
