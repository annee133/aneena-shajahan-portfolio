import gsap from 'gsap'

export function initCursor() {
  const cursor = document.querySelector('.cursor')
  const ring = document.querySelector('.cursor-ring')
  const hoverables = 'a, button, .magnetic, .project-item'

  let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  let mouse = { x: pos.x, y: pos.y }
  let speed = 0.1

  const xSet = gsap.quickSetter(ring, "x", "px")
  const ySet = gsap.quickSetter(ring, "y", "px")

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    gsap.to(cursor, { duration: 0.3, x: mouse.x, y: mouse.y, ease: 'power3.out' })
  })

  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio())
    pos.x += (mouse.x - pos.x) * dt
    pos.y += (mouse.y - pos.y) * dt
    xSet(pos.x)
    ySet(pos.y)
  })

  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'))
    el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'))
  })
}