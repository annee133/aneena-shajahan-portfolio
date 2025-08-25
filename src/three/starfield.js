// src/three/starfield.js
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger here
export function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return { update: () => {} };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 1;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const starCount = 5000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    const color = new THREE.Color();
    if (Math.random() > 0.9) { color.setHSL(Math.random(), 1.0, 0.7); } 
    else { color.setRGB(0.8, 0.8, 0.8); } // Use a light grey instead of pure white
    colors[i*3+0] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const starsMaterial = new THREE.PointsMaterial({ size: 0.02, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, });
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
  function update(progress) {
    starField.position.z = progress * 10;
    renderer.render(scene, camera);
  }
  function onResize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { clientWidth, clientHeight } = parent;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    const trigger = ScrollTrigger.getById('starfield-trigger');
    if (trigger) { update(trigger.progress); }
  }
  new ResizeObserver(onResize).observe(canvas.parentElement);
  onResize();
  return { update };
}