/**
 * Richard Ibambasi - Portfolio
 * Interactive JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initNavbarScroll();
    initSmoothScroll();
    initActiveNavLink();
    initThemeToggle();
    initBackToTop();
    initProjectFilter();
    initCountUp();
    initScrollReveal();
    initContactForm();
});

/* ============================================
   1. TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const output = document.getElementById('typedOutput');
    if (!output) return;

    const phrases = [
        'Full-Stack Enthusiast',
        'Spring Boot & Angular',
        'Problem Solver',
        'Clean Code Advocate',
        'Brussels-Based Developer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 2000;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            output.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            output.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

/* ============================================
   2. NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbarScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ============================================
   3. SMOOTH SCROLL FOR NAV LINKS
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });

                // Close mobile menu if open
                const navCollapse = document.getElementById('navMenu');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });
}

/* ============================================
   4. ACTIVE NAV LINK ON SCROLL
   ============================================ */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
}

/* ============================================
   5. DARK / LIGHT THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    const savedTheme = localStorage.getItem('portfolio-theme');

    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'bi bi-sun-fill';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            icon.className = 'bi bi-moon-fill';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.className = 'bi bi-sun-fill';
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });
}

/* ============================================
   6. BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   7. PROJECT FILTER
   ============================================ */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                    item.style.transitionDelay = `${index * 0.05}s`;
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                    item.style.transitionDelay = '0s';
                }
            });
        });
    });
}

/* ============================================
   8. COUNT-UP ANIMATION FOR STATS
   ============================================ */
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const options = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateCount(el, target) {
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target + '+';
            return;
        }
        el.textContent = Math.floor(current) + '+';
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ============================================
   9. SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
    // Add reveal class to elements
    const revealSelectors = [
        '.skill-card',
        '.timeline-item',
        '.project-card',
        '.contact-card',
        '.about-content',
        '.about-stats',
        '.language-bars'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================
   10. CONTACT FORM HANDLING
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const subject = document.getElementById('formSubject').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        if (!name || !email || !message) {
            showFormFeedback('Please fill in all required fields.', 'danger');
            return;
        }

        // Construct mailto link as fallback (no backend needed for GitHub Pages)
        const mailtoSubject = encodeURIComponent(subject || `Portfolio Contact from ${name}`);
        const mailtoBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        );
        const mailtoLink = `mailto:ibambasi.guyrichard@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        window.location.href = mailtoLink;

        showFormFeedback('Opening your email client...', 'success');
        form.reset();
    });
}

function showFormFeedback(message, type) {
    // Remove existing feedback
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const form = document.getElementById('contactForm');
    const feedback = document.createElement('div');
    feedback.className = `form-feedback alert alert-${type} mt-3 text-center`;
    feedback.textContent = message;
    form.appendChild(feedback);

    setTimeout(() => feedback.remove(), 4000);
}
