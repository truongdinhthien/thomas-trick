import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis'

function easing(x) {
    return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

const lenis = new Lenis({
  duration: 1.2,
  easing: easing, // https://easings.net
  smooth: true,
  direction: 'vertical',
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger);

// Handle hero scroll trigger
const heroImgs = gsap.utils.toArray('.hero__middle-figure');
const heroImgsWrap= document.querySelector('.hero__middle');

const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.section__hero',
        start: 'top top',
        end: "bottom bottom",
        scrub: 0.4,
        markers: true,
    }
}).to('.hero__title-duplicate', {
    clipPath: 'inset(0 0% 0 0)',
    duration: heroImgs.length,
}, 0);

const getOffsetLeftImg = (el, i) => {
    const wrapWidth = heroImgsWrap.getBoundingClientRect().width;
    const eleWidth = el.getBoundingClientRect().width;
    const offsetLeft =  (wrapWidth - eleWidth) / (heroImgs.length - 1) * (i-1);
    return offsetLeft || 0;
}
gsap.set(heroImgs[0], { autoAlpha: 1 });
heroImgs.forEach((el, i) => {
    if(i !== 0) {
        gsap.set(heroImgs[i], {x: getOffsetLeftImg(el, i) });
        heroTl.to(heroImgs[i - 1], {autoAlpha: 0,x: "+=10%", duration: 1}, i);
    }
    heroTl.to(el, { x: getOffsetLeftImg(el, i + 1), autoAlpha: 1, duration: 1}, i);
})

// Handle discover scroll trigger

gsap.timeline({
    scrollTrigger: {
        trigger: '.section__hero',
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
    }
}).fromTo('.section__discover', { y: -window.innerHeight }, { y: 0, ease: 'none' });