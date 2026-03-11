uniform float uTime;
uniform vec3 uBackgroundColor;
uniform vec3 uBlob1Color;
uniform vec3 uBlob2Color;
uniform float uBlobRadius;
uniform float uBlobStrength;
uniform float uVelocity;
uniform float uProgress;

varying vec2 vUv;

// Pseudo-random
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

// Smooth noise
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;

  // Deform UV based on velocity
  float deform = abs(uVelocity) * 0.12;
  uv.y += sin(uv.x * 3.0 + uTime * 0.5) * deform;
  uv.x += cos(uv.y * 2.0 + uTime * 0.3) * deform * 0.5;

  // Blob 1 position — slow organic drift
  vec2 blob1Center = vec2(
    0.28 + sin(uTime * 0.4) * 0.12,
    0.38 + cos(uTime * 0.3) * 0.14
  );

  // Blob 2 position
  vec2 blob2Center = vec2(
    0.72 + cos(uTime * 0.35 + 1.2) * 0.1,
    0.62 + sin(uTime * 0.45 + 0.8) * 0.12
  );

  // Aspect correction
  vec2 aspect = vec2(16.0 / 9.0, 1.0);
  float d1 = length((uv - blob1Center) * aspect);
  float d2 = length((uv - blob2Center) * aspect);

  float r = uBlobRadius + abs(uVelocity) * 0.08;
  float blob1 = smoothstep(r + 0.25, r - 0.05, d1) * uBlobStrength;
  float blob2 = smoothstep(r + 0.2, r - 0.05, d2) * uBlobStrength;

  // Film grain
  float grain = (rand(uv + fract(uTime * 0.1)) - 0.5) * 0.025;

  // Color composition
  vec3 color = uBackgroundColor;
  color = mix(color, uBlob1Color, blob1);
  color = mix(color, uBlob2Color, blob2);

  // Slight luminance boost in center
  float vignette = 1.0 - length((uv - 0.5) * 1.2);
  color += vignette * 0.04;

  color += grain;
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
