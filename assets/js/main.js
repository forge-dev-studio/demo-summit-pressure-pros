/* ============================================
   LANDSCAPING & TREE SERVICE - MAIN JAVASCRIPT
   Navigation, UI Interactions, and Utilities
   ============================================ */

(function() {
  'use strict';

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');
  const faqItems = document.querySelectorAll('.faq-item');

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  function initMobileNav() {
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
      const isActive = this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      // Update ARIA attributes
      this.setAttribute('aria-expanded', isActive);
      mobileNav.setAttribute('aria-hidden', !isActive);
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // HEADER SCROLL BEHAVIOR
  // ==========================================
  function initHeaderScroll() {
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;
      
      // Add/remove scrolled class for shadow
      if (scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // ACTIVE NAVIGATION LINK
  // ==========================================
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Handle both relative and absolute paths
      if (linkPath === currentPath || 
          currentPath.endsWith(linkPath) ||
          (linkPath !== '/' && linkPath !== 'index.html' && currentPath.includes(linkPath.replace('.html', '')))) {
        link.classList.add('active');
      } else if (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
        link.classList.add('active');
      }
    });
  }

  // ==========================================
  // FAQ ACCORDION
  // ==========================================
  function initFaqAccordion() {
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');
      
      if (!question || !answer) return;

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all other items (optional - remove for multi-open)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        
        // Update ARIA attributes
        this.setAttribute('aria-expanded', !isActive);
      });
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================
  // LAZY LOADING IMAGES
  // ==========================================
  function initLazyLoading() {
    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports lazy loading
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
      }
    }
  }

  // ==========================================
  // FORM VALIDATION (Basic)
  // ==========================================
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });
        
        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // ==========================================
  // ANIMATE ON SCROLL (Simple)
  // ==========================================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length || !('IntersectionObserver' in window)) return;

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // ==========================================
  // PHONE NUMBER FORMATTING
  // ==========================================
  function formatPhoneLinks() {
    // Ensure tel: links are properly formatted
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      // Remove any spaces or special characters from tel: href
      const phoneNumber = link.getAttribute('href').replace('tel:', '').replace(/\D/g, '');
      link.setAttribute('href', 'tel:' + phoneNumber);
    });
    
    // Ensure sms: links are properly formatted
    document.querySelectorAll('a[href^="sms:"]').forEach(link => {
      const phoneNumber = link.getAttribute('href').replace('sms:', '').replace(/\D/g, '');
      link.setAttribute('href', 'sms:' + phoneNumber);
    });
  }

  // ==========================================
  // CURRENT YEAR IN FOOTER
  // ==========================================
  function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  }

  // ==========================================
  // INITIALIZE ALL FUNCTIONS
  // ==========================================
  function init() {
    initMobileNav();
    initHeaderScroll();
    setActiveNavLink();
    initFaqAccordion();
    initSmoothScroll();
    initLazyLoading();
    initFormValidation();
    initScrollAnimations();
    formatPhoneLinks();
    updateCopyrightYear();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
