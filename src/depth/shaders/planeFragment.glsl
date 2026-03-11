uniform sampler2D uTexture;
uniform float uOpacity;
uniform vec3 uAccentColor;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 tex = texture2D(uTexture, uv);

  // Subtle edge vignette on the plane itself
  vec2 centered = uv - 0.5;
  float vignette = 1.0 - dot(centered * 1.6, centered * 1.6);
  vignette = clamp(vignette, 0.0, 1.0);
  vignette = pow(vignette, 0.4);

  vec3 color = tex.rgb * vignette;

  gl_FragColor = vec4(color, tex.a * uOpacity);
}
