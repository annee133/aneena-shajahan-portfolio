uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // 1. Calculate color based on the noise value (maps -1 to 1 range to 0 to 1)
  float noise = (vNoise + 1.0) * 0.5;
  vec3 color = mix(uColorA, uColorB, noise);

  // 2. Calculate fresnel (rim lighting) to make edges glow
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
  fresnel = pow(fresnel, 2.5); // Use pow() to control the intensity and falloff of the glow
  
  // 3. Combine the base color with the fresnel effect
  vec3 finalColor = color + fresnel * 0.6; // Add the fresnel glow to the base color

  gl_FragColor = vec4(finalColor, 1.0);
}