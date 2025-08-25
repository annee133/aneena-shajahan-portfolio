// src/main.js
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { WebGLScene } from './three/scene.js'
import { initCursor } from './animations/cursor.js'
import { initMagnetic } from './animations/magnetic.js'
import { initHoverReveal } from './animations/hoverReveal.js'
import { initStarfield } from './three/starfield.js'
gsap.registerPlugin(ScrollTrigger)

window.addEventListener('DOMContentLoaded', () => {
  initialize();
});

function initialize() {
  const cardColors = ['#690076','#0435a0','#015a3e','#8a1143'];
  const lenis = new Lenis({ duration: 0.8 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
  gsap.ticker.lagSmoothing(0);
  const heroScene = new WebGLScene('webgl-canvas'); heroScene.init('particles');
  const aboutScene = new WebGLScene('about-canvas');
  aboutScene.init('blob', { colorA: '#8a5cff', colorB: '#ff0033', amplitude: 0.15, frequency: 1.5 });
  initCursor(); initMagnetic(); initHoverReveal();
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5, y = (e.clientY / window.innerHeight) - 0.5;
    heroScene.updateMousePosition(x, y); aboutScene.updateMousePosition(x, y);
  });
  gsap.utils.toArray('.split').forEach((target) => {
    const split = new SplitType(target, { types: 'words, chars' });
    gsap.from(split.chars, {
        scrollTrigger: { trigger: target, start: 'top 90%', toggleActions: 'play none none none', },
        yPercent: 100, opacity: 0, duration: 0.6,
        ease: 'power2.out', stagger: { amount: 0.2 },
    });
  });
  
  const cards = gsap.utils.toArray('.skill-card');
  cards.forEach((card, index) => {
    const color = cardColors[index % cardColors.length];
    card.querySelectorAll('.card-front, .card-back').forEach(face => face.style.backgroundColor = color);
  });
  
  // --- RESPONSIVE SKILLS CARD ANIMATION ---
  gsap.matchMedia().add({
    isDesktop: `(min-width: 1025px)`, // Large screens
    isTablet: `(min-width: 768px) and (max-width: 1024px)`, // Tablet screens
    isMobile: `(max-width: 767px)` // Mobile screens
  }, (context) => {
    let { isDesktop, isTablet, isMobile } = context.conditions;
    
    gsap.set(cards, { x: (i) => i * 10, y: (i) => i * 10 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.skills-section', start: 'top top', end: '+=2000',
        scrub: 1, pin: '.skills-content', anticipatePin: 1
      }
    });
    tl.to('.skills-title', { y: -200, opacity: 0, ease: 'power1.in' })
    .to(cards, {
      x: (i) => {
        const centerOffset = (i - (cards.length - 1) / 2);
        if (isDesktop) return centerOffset * 320;
        if (isTablet) return centerOffset * 220; // Closer spread for tablets
        return centerOffset * 100; // Even closer for mobile
      },
      rotation: (i) => (i - (cards.length - 1) / 2) * 10,
      y: 0, ease: 'power1.inOut', stagger: 0.1
    }, "<")
    .to('.card-inner', { rotateY: 180, ease: 'power2.inOut', stagger: 0.1 }, "-=0.5");
  });
  
  const lightbox = document.querySelector('.lightbox');
  const lightboxVideo = lightbox.querySelector('video');
  const projectItems = document.querySelectorAll('.project-item');
  const lightboxCloseBtn = document.querySelector('.lightbox-close');
  projectItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = item.getAttribute('data-video');
      if (videoSrc) {
        lightboxVideo.src = videoSrc; lightbox.classList.add('is-active'); lenis.stop();
      }
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('is-active'); lightboxVideo.pause();
    lightboxVideo.src = ""; lenis.start();
  }
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  
  const finalSequence = initStarfield();
  ScrollTrigger.create({
    id: 'starfield-trigger', trigger: ".final-sequence", start: "top top",
    end: "bottom bottom", scrub: 1.5,
    onUpdate: (self) => { if (finalSequence && finalSequence.update) { finalSequence.update(self.progress); } },
  });
  gsap.timeline({
      scrollTrigger: { trigger: ".final-sequence", start: "20% center", end: "80% center", scrub: 1, }
  })
  .to(".final-sequence-text", { opacity: 1, duration: 1 })
  .to(".final-sequence-text", { opacity: 0, duration: 1 }, "+=2")
  .to(".final-sequence-endcard", { onStart: () => { document.querySelector('.final-sequence-endcard').classList.add('is-visible'); }, onReverseComplete: () => { document.querySelector('.final-sequence-endcard').classList.remove('is-visible'); } }, ">");

  gsap.to(".scroll-prompt", {
    scrollTrigger: {
      trigger: ".final-sequence", start: "top 80%",
      end: "top 60%", scrub: true,
    },
    opacity: 0
  });
}