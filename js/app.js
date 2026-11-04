/**
 * SHAKARI SHAR - Modern Industrial & Mining Web Application
 * Core Script: Multilingual (EN, AR, KU) with RTL, Hero Slider, Service Modals, Form Submissions, Mobile Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentLang = localStorage.getItem('shakari_lang') || 'en';
  let currentTheme = localStorage.getItem('shakari_theme') || 'dark';
  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000;

  // DOM Elements
  const header = document.getElementById('siteHeader');
  const siteHeaderLogo = document.getElementById('siteHeaderLogo');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const mobileThemeIcon = document.getElementById('mobileThemeIcon');
  const mobileThemeText = document.getElementById('mobileThemeText');

  const langToggleBtn = document.getElementById('langToggleBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langOptions = document.querySelectorAll('.lang-option-btn');
  const currentLangLabel = document.getElementById('currentLangLabel');
  const currentLangFlag = document.getElementById('currentLangFlag');

  // Mobile Drawer Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-drawer-link, .drawer-quote-btn');

  const slides = document.querySelectorAll('.hero-slide');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const heroSection = document.getElementById('heroSection');

  const serviceCards = document.querySelectorAll('.service-card');
  const serviceModal = document.getElementById('serviceModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalInquireBtn = document.getElementById('modalInquireBtn');

  const quoteForm = document.getElementById('quoteForm');
  const serviceSelect = document.getElementById('fieldService');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const currentYearSpans = document.querySelectorAll('.current-year');
  const whatsappBtns = document.querySelectorAll('.js-whatsapp-link');

  // Set Current Year
  currentYearSpans.forEach(span => span.textContent = new Date().getFullYear());

  /* ==========================================================================
     MULTILINGUAL & RTL ORCHESTRATION
     ========================================================================== */
  const langMeta = {
    en: { name: 'English', flag: '🇬🇧', code: 'EN', dir: 'ltr' },
    ar: { name: 'العربية', flag: '🇮🇶', code: 'AR', dir: 'rtl' },
    ku: { name: 'کوردی', flag: '☀️', code: 'KU', dir: 'rtl' }
  };

  function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('shakari_lang', lang);

    const meta = langMeta[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;

    // Update Dropdown UI
    if (currentLangLabel) currentLangLabel.textContent = meta.name;
    if (currentLangFlag) currentLangFlag.textContent = meta.flag;

    langOptions.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update document title & meta description
    if (typeof translations !== 'undefined') {
      const t = translations[lang];
      if (t) {
        if (t.metaTitle) document.title = t.metaTitle;
        const metaDescTag = document.querySelector('meta[name="description"]');
        if (metaDescTag && t.metaDesc) metaDescTag.setAttribute('content', t.metaDesc);

        // Apply translations to DOM elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const keyPath = el.getAttribute('data-i18n');
          const val = getNestedTranslation(t, keyPath);
          if (val !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = val;
            } else {
              el.innerHTML = val;
            }
          }
        });

        // Update Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const keyPath = el.getAttribute('data-i18n-placeholder');
          const val = getNestedTranslation(t, keyPath);
          if (val !== undefined) {
            el.placeholder = val;
          }
        });
      }
    }

    // Update WhatsApp links with language specific message
    updateWhatsAppLinks();
  }

  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
  }

  function updateWhatsAppLinks() {
    const messages = {
      en: "Hello Shakari Shar, I would like to inquire about your heavy equipment and spare parts supply services.",
      ar: "مرحباً شركة شاكاري شار، أود الاستفسار بخصوص توريد المعدات الصناعية وقطع الغيار.",
      ku: "سڵاو کۆمپانیای شاکاری شار، دەمەوێت پرسیار بکەم سەبارەت بە کەرەستەی پیشەسازی و پارچەی یەدەگ."
    };
    const encoded = encodeURIComponent(messages[currentLang] || messages.en);
    whatsappBtns.forEach(btn => {
      btn.href = `https://wa.me/9647766809715?text=${encoded}`;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    });
  }

  // Language Dropdown Event Handlers
  if (langToggleBtn && langDropdown) {
    langToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      langDropdown.classList.remove('open');
    });

    langOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setLanguage(lang);
        langDropdown.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     THEME MANAGEMENT (LIGHT & DARK MODES)
     ========================================================================== */
  function setTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    currentTheme = theme;
    localStorage.setItem('shakari_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (siteHeaderLogo) {
      siteHeaderLogo.src = theme === 'dark' ? 'images/logo_dark.png' : 'images/logo_light.png';
    }

    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    if (mobileThemeIcon) {
      mobileThemeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (mobileThemeText) {
      mobileThemeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ==========================================================================
     HERO SLIDER
     ========================================================================== */
  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    sliderDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startSlideShow();
    });

    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startSlideShow();
    });

    sliderDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startSlideShow();
      });
    });

    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopSlideShow);
      heroSection.addEventListener('mouseleave', startSlideShow);
    }
  }

  /* ==========================================================================
     MOBILE DRAWER NAVIGATION (SLIDE-OUT MENU)
     ========================================================================== */
  function toggleDrawer(open) {
    if (!mobileDrawer) return;
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    mobileDrawer.classList.toggle('open', isOpen);
    if (mobileToggle) {
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.toggle('active', isOpen);
    }
    mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', () => toggleDrawer(false));
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', () => toggleDrawer(false));
  }

  // Clicking any link in the drawer closes it automatically
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Global Escape Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
      if (langDropdown && langDropdown.classList.contains('open')) {
        langDropdown.classList.remove('open');
      }
      if (serviceModal && serviceModal.classList.contains('open')) {
        closeServiceModal();
      }
    }
  });

  // Automatically close drawer when resized to desktop (>= 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleDrawer(false);
    }
  });

  /* ==========================================================================
     STICKY HEADER SHADOW ON SCROLL
     ========================================================================== */
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     INTERACTIVE SERVICE DETAILS MODAL
     ========================================================================== */
  let activeServiceId = null;

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceId = card.dataset.service;
      openServiceModal(serviceId);
    });
  });

  function openServiceModal(serviceId) {
    activeServiceId = serviceId;
    const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
    const serviceData = t && t.services && t.services[serviceId];

    if (serviceData && serviceModal) {
      if (modalTitle) modalTitle.textContent = serviceData.title;
      if (modalDesc) modalDesc.textContent = serviceData.desc;
      if (modalSpecs) modalSpecs.textContent = serviceData.detail;
      serviceModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeServiceModal);
  }

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeServiceModal();
    });
  }

  // Modal Inquire Button: Auto-selects service in contact form and scrolls down
  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeServiceModal();
      if (serviceSelect && activeServiceId) {
        serviceSelect.value = activeServiceId;
      }
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
        const formWrap = document.querySelector('.quote-form-wrap');
        if (formWrap) {
          formWrap.style.outline = '3px solid #0284c7';
          setTimeout(() => formWrap.style.outline = '', 1500);
        }
      }
    });
  }

  /* ==========================================================================
     QUOTE / CONTACT FORM SUBMISSION
     ========================================================================== */
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fieldName');
      const companyInput = document.getElementById('fieldCompany');
      const emailInput = document.getElementById('fieldEmail');
      const phoneInput = document.getElementById('fieldPhone');
      const serviceInput = document.getElementById('fieldService');
      const msgInput = document.getElementById('fieldMsg');
      const submitBtn = document.getElementById('btnFormSubmit');

      // Basic Validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        showToast("Please fill in all required fields (Name, Email, Message).", "error");
        return;
      }

      // Indicate loading
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = (typeof translations !== 'undefined' && translations[currentLang]?.contact?.sending) || "Sending...";

      const formData = {
        name: nameInput.value.trim(),
        company: companyInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        service: serviceInput.options[serviceInput.selectedIndex]?.text || serviceInput.value,
        message: msgInput.value.trim(),
        targetEmail: "danamahjad@gmail.com"
      };

      // Formspree or direct email handling
      try {
        const response = await fetch("https://formspree.io/f/mqaejgyw", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showToast((typeof translations !== 'undefined' && translations[currentLang]?.contact?.successMsg) || "Inquiry sent successfully to danamahjad@gmail.com!", "success");
          quoteForm.reset();
        } else {
          triggerMailtoFallback(formData);
        }
      } catch (err) {
        triggerMailtoFallback(formData);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function triggerMailtoFallback(data) {
    const subject = encodeURIComponent(`[Shakari Shar Inquiry] - ${data.service} from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\n` +
      `Company: ${data.company}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n` +
      `Service: ${data.service}\n\n` +
      `Message:\n${data.message}`
    );
    const mailtoUrl = `mailto:danamahjad@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    showToast((typeof translations !== 'undefined' && translations[currentLang]?.contact?.successMsg) || "Opening email to danamahjad@gmail.com...", "success");
  }

  /* ==========================================================================
     NEWSLETTER FORM
     ========================================================================== */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('nlEmail')?.value;
      if (email) {
        showToast("Thank you for subscribing to Shakari Shar updates!", "success");
        nlForm.reset();
      }
    });
  }

  /* ==========================================================================
     BACK TO TOP
     ========================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATION ENGINE
     ========================================================================== */
  function showToast(message, type = "success") {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* ==========================================================================
     INTERACTIVE 3D BACKGROUND (PARALLAX)
     ========================================================================== */
  const interactiveBg = document.getElementById('interactive-bg');
  if (interactiveBg) {
    document.addEventListener('mousemove', (e) => {
      const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      interactiveBg.style.setProperty('--mouseX', deltaX);
      interactiveBg.style.setProperty('--mouseY', deltaY);
    });
  }

  // Initialize
  setTheme(currentTheme);
  setLanguage(currentLang);
  startSlideShow();
});
