import gsap from 'gsap';
import barba from '@barba/core';
import Flip from 'gsap/Flip'

gsap.registerPlugin(Flip);

const contentDetailPageTransition = () => {
    const tl = gsap.timeline({
        defaults: {
            ease: 'power2.easeInOut',
        },
    });

    tl.from(".hero__content > *", {
        xPercent: -100,
        duration: 0.8,
        stagger: 0.3,
        clearProps: 'all',
    }).from(".main", {
        "--bg-scale": 0,
        duration: 0.8,
    }, 0.4).from(".hero__bottom > span, .summary > p", {
        opacity: 0,
        duration: 1,
        clearProps: 'all',
    }, 0.6);

    return tl
}

const introDetailPageTransition = () => {
    const tl = contentDetailPageTransition();
    gsap.set('.hero__figure', {
        overflow: 'hidden',
    })
    tl.from('.hero__figure > *', {
        xPercent: -100,
        duration: 0.8,
    }, 0.4)
    return tl;
}

barba.init({
    transitions: [{
        sync: true,
        name: 'home-to-detail',
        to: {
            namespace: ['detail']
        },
        once: () => {
            introDetailPageTransition();
        },
        leave(data) {

            // Move up the next container;
            gsap.set(data.current.container, {
                autoAlpha: 0,
            });
            gsap.set(data.next.container, {
                position: "fixed",
                inset: "0",
                zIndex: "-1",
            });

            const flipChild = data.trigger.querySelector('.project__figure > *');
            const targetFlip = document.querySelector('.hero__figure');
            const targetFlipChild = document.querySelector('.hero__figure > *');

            // Record the state
            const state = Flip.getState(flipChild);

            targetFlip.removeChild(targetFlipChild)
            targetFlip.appendChild(flipChild);

            return Flip.from(state, {
                duration: 0.8,
                ease: "power2.inOut",
                scale: true,
            });
        },
        async enter(data) {
            await contentDetailPageTransition();
            return gsap.set(data.next.container, {
                clearProps: 'all',
                onComplete: () => {
                    window.scrollTo({ top: 0 });
                }
            })
        }
    }]
});