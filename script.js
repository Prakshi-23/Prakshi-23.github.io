// LIGHTBOX COMPONENT CONTROLLER (UPGRADED RESPONSIVE DEPLOYMENT)
const lightbox = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('lightbox-close-btn');

document.querySelectorAll('.cert-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const imgUrl = btn.getAttribute('data-cert');
        if (lightboxImg) lightboxImg.src = imgUrl;
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
};

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// BACK TO TOP CONTROLLER ENGINE (BOTTOM LEFT CORNER)
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================
   PROJECT CARD PREVIEW ENGINE
   Hover a card (or, on the 4-image card, a specific dashboard link)
   for 2s -> its image appears centered inside that card -> it stays
   visible for 2.5s, then hides itself automatically.
   ============================================================ */
const PREVIEW_HOVER_DELAY = 2000;   // ms of hover before the image appears
const PREVIEW_DISPLAY_TIME = 2500;  // ms the image stays visible once shown
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

function attachPreviewTrigger(card, triggerEl, img) {
    let showTimer = null;
    let hideTimer = null;

    const reveal = () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        showTimer = null;

        // Only one image should be visible inside a card at a time
        card.querySelectorAll('.project-hover-img').forEach(i => i.classList.remove('active-preview'));
        img.classList.add('active-preview');
        card.classList.add('show-preview');

        hideTimer = setTimeout(() => {
            card.classList.remove('show-preview');
            img.classList.remove('active-preview');
            hideTimer = null;
        }, PREVIEW_DISPLAY_TIME);
    };

    triggerEl.addEventListener('mouseenter', () => {
        if (isTouchDevice) return;
        clearTimeout(showTimer);
        showTimer = setTimeout(reveal, PREVIEW_HOVER_DELAY);
    });

    triggerEl.addEventListener('mouseleave', () => {
        // Only cancel if the delay hasn't fired yet; once shown it finishes on its own
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
    });

    triggerEl.addEventListener('click', (e) => {
        if (!isTouchDevice) return;
        // On touch devices there's no hover, so a tap reveals the preview right away
        if (triggerEl.classList.contains('dash-item') || triggerEl.closest('.dash-item')) {
            e.preventDefault();
        }
        reveal();
    });
}

document.querySelectorAll('.project-card').forEach(card => {
    if (card.classList.contains('multi-hover-card')) {
        card.querySelectorAll('.dash-item').forEach(item => {
            const targetId = item.getAttribute('data-target');
            const targetImg = document.getElementById(targetId);
            if (targetImg) attachPreviewTrigger(card, item, targetImg);
        });
    } else {
        const img = card.querySelector('.project-hover-img');
        if (img) attachPreviewTrigger(card, card, img);
    }
});

/* SCROLL ANIMATION JAVASCRIPT ENGINE */
const revealSections = document.querySelectorAll('.reveal-on-scroll');
const initIntersectionObserver = () => {
    const observerOptions = {
        root: null,
        threshold: 0.05, 
        rootMargin: "0px 0px 100px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealSections.forEach(section => {
        observer.observe(section);
    });
};

if (window.IntersectionObserver) {
    initIntersectionObserver();
} else {
    revealSections.forEach(s => s.classList.add('visible'));
}

/* LIVE TERMINAL FEEDBACK DECORATOR */
const hintBox = document.getElementById('console-hint');
document.querySelectorAll('.channel-link').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        const textTarget = e.currentTarget.getAttribute('data-endpoint');
        if (hintBox) {
            hintBox.innerText = `>> ${textTarget}`;
            hintBox.style.color = '#FFFFFF';
            hintBox.style.backgroundColor = 'rgba(0, 242, 254, 0.15)';
        }
    });
    
    link.addEventListener('mouseleave', () => {
        if (hintBox) {
            hintBox.innerText = 'SELECT_ENDPOINT_BELOW_';
            hintBox.style.color = 'var(--accent)';
            hintBox.style.backgroundColor = 'rgba(0, 242, 254, 0.04)';
        }
    });
});

/* CUSTOM TRACKING CURSOR ENGINE (CROSS-PLATFORM SAFE MAGNETIC GLOW) */
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorAura = document.querySelector('.custom-cursor-aura');

if (cursorDot && cursorAura && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let isMagnetic = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        if (!isMagnetic) {
            cursorAura.style.left = `${mouseX}px`;
            cursorAura.style.top = `${mouseY}px`;
        }
    });

    // Targets cards, buttons, elements cleanly
    const dynamicMagneticTargets = document.querySelectorAll('a, .btn, .matrix-btn, .cert-view-btn, .dash-item, #navToggle, .project-card, .skill-card, .exp-card');
    
    dynamicMagneticTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            isMagnetic = true;
            cursorAura.classList.add('magnetic-active');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
            
            const rect = target.getBoundingClientRect();
            // Don't inject large offset paddings around primary global container cards
            const isLargeCard = target.classList.contains('project-card') || target.classList.contains('skill-card') || target.classList.contains('exp-card');
            const padding = isLargeCard ? 0 : 6;
            
            cursorAura.style.width = `${rect.width + padding * 2}px`;
            cursorAura.style.height = `${rect.height + padding * 2}px`;
            cursorAura.style.left = `${rect.left + rect.width / 2}px`;
            cursorAura.style.top = `${rect.top + rect.height / 2}px`;
            
            const targetRadius = window.getComputedStyle(target).borderRadius;
            cursorAura.style.borderRadius = targetRadius !== '0px' ? targetRadius : '12px';
        });

        target.addEventListener('mouseleave', () => {
            isMagnetic = false;
            cursorAura.classList.remove('magnetic-active');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorAura.style.width = '26px';
            cursorAura.style.height = '26px';
            cursorAura.style.borderRadius = '50%';
        });
    });

    window.addEventListener('mousedown', () => {
        if (!isMagnetic) cursorAura.style.transform = 'translate(-50%, -50%) scale(0.6)';
    });
    window.addEventListener('mouseup', () => {
        if (!isMagnetic) cursorAura.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    window.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}

/* ============================================================
   PRIMARY NAVBAR ENGINE
   ============================================================ */
const siteNavbar = document.getElementById('siteNavbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

if (siteNavbar) {
    const updateNavbarState = () => {
        if (window.scrollY > 40) {
            siteNavbar.classList.add('scrolled');
        } else {
            siteNavbar.classList.remove('scrolled');
        }
    };
    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
}

// Scroll to a section leaving room for the fixed navbar, instead of relying
// on the browser's default hash jump (which lands sections right under the
// navbar and hides their titles, as seen on direct #contact loads)
const scrollToSection = (target, behavior = 'smooth') => {
    if (!target) return;
    const navH = siteNavbar ? siteNavbar.getBoundingClientRect().height : 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - (navH + 20);
    window.scrollTo({ top, behavior });
};

if (navToggle && navLinks) {
    const setNavOpen = (open) => {
        navToggle.classList.toggle('open', open);
        navLinks.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('nav-open', open);
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setNavOpen(!navLinks.classList.contains('open'));
    });

    navLinkEls.forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            const target = hash && hash.startsWith('#') ? document.querySelector(hash) : null;
            if (target) {
                e.preventDefault();
                setNavOpen(false);
                scrollToSection(target);
                history.pushState(null, '', hash);
            } else {
                setNavOpen(false);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            setNavOpen(false);
        }
    });

    // Don't leave the mobile panel "open" (and body scroll locked) if the
    // viewport is resized up to desktop width where the toggle is hidden
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) setNavOpen(false);
    });
}

// Correct the scroll position on a direct page load with a #hash in the URL
// (e.g. site.com/#contact) — the browser's native jump ignores the fixed
// navbar's height and hides the top of the target section behind it.
if (window.location.hash) {
    window.addEventListener('load', () => {
        const target = document.querySelector(window.location.hash);
        // Run after the browser's own (incorrect) jump so ours wins
        setTimeout(() => scrollToSection(target, 'auto'), 0);
    });
}

if (navLinkEls.length && window.IntersectionObserver) {
    const navSections = Array.from(navLinkEls)
        .map(link => document.getElementById(link.getAttribute('data-nav')))
        .filter(Boolean);

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-nav') === id);
                });
            }
        });
    }, { root: null, rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    navSections.forEach(section => spyObserver.observe(section));
}

/* MINIMAL AMBIENT BACKGROUND — PARTICLE CONSTELLATION */
const bgCanvas = document.getElementById('bg-particles');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (bgCanvas && !prefersReducedMotion) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];
    let width, height;
    const ACCENT = '0, 242, 254';
    const DENSITY = 14000; 
    const LINK_DIST = 130;

    const resizeCanvas = () => {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
        const count = Math.min(70, Math.floor((width * height) / DENSITY));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.4 + 0.6
        }));
    };

    const step = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${ACCENT}, ${0.12 * (1 - dist / LINK_DIST)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(step);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(step);
}