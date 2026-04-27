/* ============================================
   Cook Group Analytics - Website Scripts
   ============================================ */

(function () {
    'use strict';

    // --- Navbar scroll behavior ---
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer for scroll animations ---
    function createScrollObserver() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, parseInt(delay, 10));
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    }

    createScrollObserver();

    // --- Animated number counter ---
    function animateCounters() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(function (counter) {
                        animateCounter(counter);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        var statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            observer.observe(statsBar);
        }
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 2000;
        var startTime = null;

        // For large numbers, abbreviate
        var isLarge = target >= 100000;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.floor(easedProgress * target);

            if (isLarge) {
                // Show as "1M" or abbreviated
                if (current >= 1000000) {
                    el.textContent = (current / 1000000).toFixed(current < target ? 1 : 0) + 'M';
                } else if (current >= 1000) {
                    el.textContent = Math.floor(current / 1000) + 'K';
                } else {
                    el.textContent = current;
                }
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Final value
                if (isLarge) {
                    el.textContent = '1M';
                } else {
                    el.textContent = target;
                }
            }
        }

        requestAnimationFrame(step);
    }

    animateCounters();

    // --- Active nav link highlighting on scroll ---
    function highlightNavOnScroll() {
        var sections = document.querySelectorAll('section[id]');
        var navLinksAll = document.querySelectorAll('.nav-link:not(.nav-cta)');

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY + 120;
            sections.forEach(function (section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinksAll.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    highlightNavOnScroll();

    // --- Parallax for hero background shapes ---
    function initParallax() {
        var shapes = document.querySelectorAll('.shape');
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY > window.innerHeight) return; // Only parallax in hero
            shapes.forEach(function (shape, i) {
                var speed = (i + 1) * 0.05;
                shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
            });
        }, { passive: true });
    }

    initParallax();

    // --- Tilt effect on feature cards ---
    function initCardTilt() {
        var cards = document.querySelectorAll('.product-feature');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = (y - centerY) / centerY * -3;
                var rotateY = (x - centerX) / centerX * 3;
                card.style.transform = 'translateY(-4px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
            });
        });
    }

    initCardTilt();

    // --- Typing effect for hero badge (subtle pulse) ---
    function initBadgePulse() {
        var badge = document.querySelector('.hero-badge');
        if (badge) {
            setInterval(function () {
                badge.style.boxShadow = '0 0 0 6px rgba(200, 150, 46, 0.12)';
                setTimeout(function () {
                    badge.style.boxShadow = '0 0 0 0px rgba(200, 150, 46, 0)';
                }, 800);
            }, 3000);
        }
    }

    initBadgePulse();

})();
