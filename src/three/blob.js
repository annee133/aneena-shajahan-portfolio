// src/three/blob.js

import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shaders/blob.vert?raw'
import fragmentShader from '../shaders/blob.frag?raw'

export function createBlob(config = {}) {
  const {
    colorA = '#8a5cff',
    colorB = '#ff0033',
    amplitude = 0.25,
    frequency = 2.0
  } = config

  const geometry = new THREE.IcosahedronGeometry(1, 64)

  const uniforms = {
    uTime: { value: 0 },
    uFrequency: { value: frequency },
    uAmplitude: { value: amplitude },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  })

  const mesh = new THREE.Mesh(geometry, material)

  function update(time) {
    material.uniforms.uTime.value = time * 0.3
  }
  
  function updateMouse(x, y) {
      gsap.to(material.uniforms.uMouse.value, {
          x: x,
          y: y,
          duration: 1.5,
          ease: 'power3.out'
      })
  }

  return { mesh, update, updateMouse }
}