/* ============================================================
   script.js — Ramya Residency Premium Hotel Website
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });

    // Back to top
    const btt = document.getElementById('backToTop');
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });


  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });


  /* ── 3. HERO SLIDER ── */
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.querySelectorAll('.dot')[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsContainer.querySelectorAll('.dot')[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
  }
  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  document.getElementById('sliderNext').addEventListener('click', () => { nextSlide(); resetSlider(); });
  document.getElementById('sliderPrev').addEventListener('click', () => { prevSlide(); resetSlider(); });

  startSlider();

  // Swipe support for hero slider
  let heroTouchStartX = 0;
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('touchstart', e => { heroTouchStartX = e.touches[0].clientX; });
  heroEl.addEventListener('touchend', e => {
    const diff = heroTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetSlider(); }
  });


  /* ── 4. FADE-IN INTERSECTION OBSERVER ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));


  /* ── 5. GALLERY LIGHTBOX ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Give transition time before clearing src
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function lightboxNavigate(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex].src;
      lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
  lightboxNext.addEventListener('click', () => lightboxNavigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNavigate(1);
    if (e.key === 'ArrowLeft') lightboxNavigate(-1);
  });

  // Swipe support for lightbox
  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', e => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lightboxNavigate(diff > 0 ? 1 : -1);
  });


  /* ── 6. TESTIMONIAL SLIDER ── */
  const track = document.getElementById('testimonialTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialDots');
  let currentTestimonial = 0;
  let itemsVisible = 3;

  function getItemsVisible() {
    if (window.innerWidth < 900) return 1;
    if (window.innerWidth < 1100) return 2;
    return 3;
  }

  function buildTestimonialDots() {
    dotsWrap.innerHTML = '';
    itemsVisible = getItemsVisible();
    const pages = Math.ceil(cards.length / itemsVisible);
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.classList.add('dot');
      d.style.cssText = 'background:rgba(0,0,0,0.2)';
      if (i === 0) {
        d.classList.add('active');
        d.style.cssText = 'background:var(--gold);width:24px;border-radius:4px;height:8px;';
      }
      d.addEventListener('click', () => goToTestimonial(i));
      dotsWrap.appendChild(d);
    }
  }

  function goToTestimonial(n) {
    itemsVisible = getItemsVisible();
    const cardWidth = cards[0].getBoundingClientRect().width + 32; // gap
    currentTestimonial = n;
    track.style.transform = `translateX(-${n * itemsVisible * cardWidth}px)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      if (i === n) {
        d.style.cssText = 'background:var(--gold);width:24px;border-radius:4px;height:8px;display:inline-block;';
      } else {
        d.style.cssText = 'background:rgba(0,0,0,0.15);width:8px;border-radius:50%;height:8px;display:inline-block;';
      }
    });
  }

  buildTestimonialDots();
  window.addEventListener('resize', buildTestimonialDots);

  // Auto scroll testimonials
  setInterval(() => {
    itemsVisible = getItemsVisible();
    const pages = Math.ceil(cards.length / itemsVisible);
    goToTestimonial((currentTestimonial + 1) % pages);
  }, 4500);


  /* ── 7. SMOOTH SCROLL for NAV ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 8. BACK TO TOP ── */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 9. NAVBAR CTA COLOR ── */
  const navCta = document.getElementById('navCta');
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      navCta.style.borderColor = 'rgba(255,255,255,0.5)';
      navCta.style.color = 'rgba(255,255,255,0.9)';
    } else {
      navCta.style.borderColor = 'var(--gold)';
      navCta.style.color = 'var(--gold)';
    }
  });


  /* ── 10. LIGHTBOX IMAGE TRANSITION STYLE ── */
  lightboxImg.style.transition = 'opacity 0.2s ease';

});
