// src/three/particleSystem.js

import * as THREE from 'three'

export function createParticleSystem() {
  const particleCount = 250
  const particles = []
  const mouse = new THREE.Vector3(9999, 9999, 0)
  const container = new THREE.Group()

  const geometries = [
    new THREE.IcosahedronGeometry(0.12, 0),
    new THREE.CapsuleGeometry(0.06, 0.12, 4, 8),
    new THREE.TorusGeometry(0.09, 0.03, 8, 16),
    new THREE.ConeGeometry(0.12, 0.18, 6),
  ]

  const meshes = geometries.map(geo => {
    const material = new THREE.MeshBasicMaterial()
    const mesh = new THREE.InstancedMesh(geo, material, particleCount)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    container.add(mesh)
    return mesh
  })

  const instanceCounters = Array(geometries.length).fill(0);

  const grid = { width: 22, hexSize: 0.7 }
  const hexHeight = grid.hexSize * Math.sqrt(3)
  const hexWidth = grid.hexSize * 2
  
  let count = 0
  let y = -4.0
  while(count < particleCount) {
    for (let x = -grid.width / 2; x < grid.width / 2 && count < particleCount; x += hexWidth / 2) {
      if (Math.abs(x) > grid.width / 2) continue;
      const homePosition = new THREE.Vector3(x+(Math.random()-0.5)*0.2, y+(Math.random()-0.5)*0.2, (Math.random()-0.5)*2)
      const rand = Math.random()
      let color;
      if (rand < 0.2) { color = new THREE.Color().setHSL(Math.random(), 1, 0.5) }
      else { color = new THREE.Color(0x222222) }
      const meshIndex = count % meshes.length;
      const instanceIndex = instanceCounters[meshIndex];
      particles.push({ meshIndex, instanceIndex, homePosition, currentPosition: homePosition.clone(), velocity: new THREE.Vector3(), rotation: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI), color })
      instanceCounters[meshIndex]++;
      count++;
    }
    y += hexHeight * 0.75
  }

  function update() {
    // --- UPDATED --- Final physics tuning for better interaction
    const mouseRepulsion = 4.0;   // Increased push force
    const mouseRadius = 2.5;      // Increased area of effect
    const homeAttraction = 0.002; // Decreased spring force
    const damping = 0.94;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const mouseDistance = p.currentPosition.distanceTo(mouse)
      if (mouseDistance < mouseRadius) {
        const repulsionForce = new THREE.Vector3().subVectors(p.currentPosition, mouse).normalize().multiplyScalar(mouseRepulsion / (mouseDistance * mouseDistance + 0.1))
        p.velocity.add(repulsionForce)
      }
      const attractionForce = new THREE.Vector3().subVectors(p.homePosition, p.currentPosition).multiplyScalar(homeAttraction)
      p.velocity.add(attractionForce)
      p.velocity.multiplyScalar(damping)
      p.currentPosition.add(p.velocity)
      const dummy = new THREE.Object3D()
      dummy.position.copy(p.currentPosition); dummy.rotation.copy(p.rotation); dummy.updateMatrix()
      const mesh = meshes[p.meshIndex]
      mesh.setMatrixAt(p.instanceIndex, dummy.matrix); mesh.setColorAt(p.instanceIndex, p.color)
    }
    meshes.forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    })
  }

  function updateMouse(worldX, worldY) { mouse.x = worldX; mouse.y = worldY }
  return { mesh: container, update, updateMouse }
}