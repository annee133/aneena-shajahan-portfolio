// src/three/scene.js

import * as THREE from 'three'
import { createBlob } from './blob.js'
import { createParticleSystem } from './particleSystem.js'

export class WebGLScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100)
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true })
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // --- UPDATED --- Create the clock ONCE in the constructor
    this.clock = new THREE.Clock()

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);
    
    this.animate = this.animate.bind(this)
    this.animate()
  }

  init(type, config) {
    // --- UPDATED --- Store the animation type
    this.type = type;

    if (this.type === 'blob') {
        this.animation = createBlob(config);
        this.camera.position.z = 3.5;
    } else if (this.type === 'particles') {
        this.animation = createParticleSystem();
        this.camera.position.z = 5;
    }
    this.scene.add(this.animation.mesh);
    this.animation.mesh.scale.set(0.6, 0.6, 0.6); // <-- ADD THIS LINE
  }

  animate() {
    if (this.isVisible && this.animation) {
        // --- UPDATED --- Use the stored clock and call update correctly for each type
        if (this.type === 'blob') {
            this.animation.update(this.clock.getElapsedTime());
        } else {
            this.animation.update(); // Particle system doesn't need time passed to it
        }
        this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(this.animate);
  }
  
  updateMousePosition(x, y) {
    if (!this.animation) return;
    
    // --- THE DEFINITIVE FIX ---
    // Use the stored 'this.type' to choose the correct mouse update logic
    if (this.type === 'particles') {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(x * 2, y * -2);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.setFromCamera(pointer, this.camera);
        raycaster.ray.intersectPlane(plane, intersectPoint);
        this.animation.updateMouse(intersectPoint.x, intersectPoint.y);
    } else { // This is for the 'blob'
        this.animation.updateMouse(x, y);
    }
  }

  onResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
  }
}