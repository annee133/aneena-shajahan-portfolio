// src/animations/hoverReveal.js

import gsap from 'gsap'

export function initHoverReveal() {
  const container = document.createElement('div'); container.className = 'hover-image-container'; document.body.appendChild(container);
  const img = document.createElement('img');
  const video = document.createElement('video');
  video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
  container.appendChild(img); container.appendChild(video);

  // --- CORRECTED SELECTOR ---
  const items = document.querySelectorAll('.project-item');

  items.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const mediaSrc = item.getAttribute('data-img');
      if (!mediaSrc) return;
      if (mediaSrc.endsWith('.mp4')) {
        img.style.display = 'none'; video.style.display = 'block';
        if (video.src !== new URL(mediaSrc, window.location.href).href) { video.src = mediaSrc }
        video.play();
      } else {
        video.style.display = 'none'; img.style.display = 'block';
        if (img.src !== new URL(mediaSrc, window.location.href).href) { img.src = mediaSrc }
      }
      gsap.set(container, { x: e.clientX, y: e.clientY });
      gsap.to(container, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(container, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power3.in' });
      video.pause();
    });
    item.addEventListener('mousemove', (e) => {
      gsap.to(container, { x: e.clientX + 20, y: e.clientY, duration: 0.5, ease: 'power3.out' });
    });
  });
}