uniform float uTime;
uniform float uBreath;
uniform float uParallaxX;
uniform float uParallaxY;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Breath: subtle scale pulse
  pos.x *= 1.0 + uBreath * 0.04;
  pos.y *= 1.0 + uBreath * 0.04;

  // Parallax offset
  pos.x += uParallaxX * 0.3;
  pos.y += uParallaxY * 0.15;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
