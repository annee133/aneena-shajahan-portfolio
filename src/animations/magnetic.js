import gsap from 'gsap'

export function initMagnetic() {
  const elements = document.querySelectorAll('.magnetic')
  
  elements.forEach(el => {
    // Read the strength from the data attribute, or use a default value
    const strength = parseFloat(el.dataset.strength) || 0.3

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      
      // Calculate the mouse position relative to the center of the element
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      // Use GSAP to smoothly move the element towards the mouse
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.8, // Make the animation smooth
        ease: 'power3.out'
      })
    })

    // When the mouse leaves, animate the element back to its original position
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { 
        x: 0, 
        y: 0, 
        duration: 1, // A longer duration with an elastic ease for a nice snap-back effect
        ease: 'elastic.out(1, 0.3)' 
      })
    })
  })
}