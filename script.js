/* ============================================================
   script.js — Ramya Residency | Quiet Luxury Experience
   Slow transitions, parallax, staggered reveals, side-drawer
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Scrolled class — frosted glass transition
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });

    // Back to top
    const btt = document.getElementById('backToTop');
    if (scrollY > 500) btt.classList.add('visible');
    else btt.classList.remove('visible');
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── 2. HAMBURGER & SIDE DRAWER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    hamburger.classList.add('open');
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (sideDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer when clicking a link
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sideDrawer.classList.contains('open')) {
      closeDrawer();
    }
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
    dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    const dots = dotsContainer.querySelectorAll('.dot');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 6000); // Slower — luxury pacing
  }
  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  startSlider();

  // Swipe support for hero slider
  let heroTouchStartX = 0;
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('touchstart', e => { heroTouchStartX = e.touches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = heroTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetSlider(); }
  });


  /* ── 4. SCROLL REVEAL (Intersection Observer) ── */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


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
    setTimeout(() => { lightboxImg.src = ''; }, 500);
  }

  function lightboxNavigate(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex].src;
      lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
      lightboxImg.style.opacity = '1';
    }, 250);
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
  lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lightboxNavigate(diff > 0 ? 1 : -1);
  });

  // Lightbox image transition
  lightboxImg.style.transition = 'opacity 0.3s ease';


  /* ── 6. SMOOTH SCROLL for ALL ANCHOR LINKS ── */
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


  /* ── 7. BACK TO TOP ── */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 8. SUBTLE PARALLAX on HERO ── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
          const parallaxAmount = scrollY * 0.3;
          const opacityAmount = 1 - (scrollY / window.innerHeight) * 1.2;
          heroContent.style.transform = `translateY(${parallaxAmount}px)`;
          heroContent.style.opacity = Math.max(0, opacityAmount);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ── 9. BOOKING FORM — WhatsApp Integration ── */
  const bookingBtn = document.querySelector('.booking-form .btn-book');
  if (bookingBtn) {
    // Optional: Enhance the booking button to send WhatsApp with form data
    bookingBtn.addEventListener('click', (e) => {
      const name = document.getElementById('bookName')?.value || '';
      const phone = document.getElementById('bookPhone')?.value || '';
      const checkin = document.getElementById('bookCheckin')?.value || '';
      const checkout = document.getElementById('bookCheckout')?.value || '';
      const room = document.getElementById('bookRoom')?.value || '';
      const guests = document.getElementById('bookGuests')?.value || '';

      // If form has data, redirect to WhatsApp instead
      if (name || checkin || room) {
        e.preventDefault();
        const message = encodeURIComponent(
          `Hello, I'd like to book a room at Ramya Residency.\n\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          `Check-in: ${checkin}\n` +
          `Check-out: ${checkout}\n` +
          `Room: ${room}\n` +
          `Guests: ${guests}`
        );
        window.open(`https://wa.me/918123574777?text=${message}`, '_blank');
      }
    });
  }


  /* ── 10. SET MIN DATE on BOOKING FIELDS ── */
  const today = new Date().toISOString().split('T')[0];
  const checkinField = document.getElementById('bookCheckin');
  const checkoutField = document.getElementById('bookCheckout');
  if (checkinField) checkinField.setAttribute('min', today);
  if (checkoutField) checkoutField.setAttribute('min', today);

  if (checkinField && checkoutField) {
    checkinField.addEventListener('change', () => {
      checkoutField.setAttribute('min', checkinField.value);
      if (checkoutField.value && checkoutField.value < checkinField.value) {
        checkoutField.value = checkinField.value;
      }
    });
  }

});
