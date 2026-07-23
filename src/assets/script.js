document.addEventListener('DOMContentLoaded', () => {
  // Set up mobile image sources on initial load if screen is narrow
  if (window.innerWidth <= 1024) {
    const isRestoPage = document.querySelector('.hero-damage-pill[data-dmg="water"]') !== null;
    const initialMobileImg = isRestoPage ? '/assets/water_damage_panorama.png' : '/assets/commercial-spaces.png';
    document.querySelectorAll('.hero-banner-img').forEach(img => {
      img.src = initialMobileImg;
    });
    const mainImg = document.getElementById('hero-main-img');
    if (mainImg) {
      mainImg.src = initialMobileImg;
    }
  }

  // Set up carousel clones for mobile
  const damagesRow = document.querySelector('.hero-damages-row');
  if (damagesRow && window.innerWidth <= 1024) {
    const originalPills = Array.from(damagesRow.children);
    originalPills.forEach(pill => {
      const clone = pill.cloneNode(true);
      clone.classList.add('is-clone');
      damagesRow.appendChild(clone);
    });
    damagesRow.classList.add('is-carousel');
  }

  // --- Services Showcase & Info Swapper (Janitorial & Restoration) ---
  const janitorialDamageInfo = {
    workspaces: {
      title: "Commercial Workspaces",
      subtitle: 'Immaculate & Safe <span class="sub-accent">Office</span> Environments',
      img: "/assets/commercial-spaces.png",
      imgMobile: "/assets/commercial-spaces.png",
      desc: "Tailored janitorial plans to keep office spaces, meeting rooms, and common areas immaculate, safe, and hygienic.",
      cta: "Get a Quote \u2192"
    },
    construction: {
      title: "Post-Construction Cleanup",
      subtitle: 'Complete <span class="sub-accent">Dust</span> Suppression & Scrubbing',
      img: "/assets/construction-cleanup.png",
      imgMobile: "/assets/construction-cleanup.png",
      desc: "Comprehensive dust suppression, plaster residue scrubbing, and detail cleaning to prepare new builds for immediate occupancy.",
      cta: "Get a Quote \u2192"
    },
    industrial: {
      title: "Industrial Facility Sanitizing",
      subtitle: 'Heavy-Duty <span class="sub-accent">Warehouse</span> Floor Scrubbing',
      img: "/assets/industrial-sanitizing.png",
      imgMobile: "/assets/industrial-sanitizing.png",
      desc: "Heavy-duty degreasing, warehouse floor scrubbing, and workspace decontamination compliant with industrial safety standards.",
      cta: "Get a Quote \u2192"
    },
    government: {
      title: "Government & Secure Facilities",
      subtitle: 'High-Security <span class="sub-accent">Administrative</span> Cleaning',
      img: "/assets/municipal-spaces.png",
      imgMobile: "/assets/municipal-spaces.png",
      desc: "Vetted cleaning staff delivering high-security janitorial maintenance for administrative, municipal, and secure government properties.",
      cta: "Get a Quote \u2192"
    },
    dealerships: {
      title: "Car Dealerships & Showrooms",
      subtitle: 'Spotless Showrooms & <span class="sub-accent">Polished</span> Glass Facades',
      img: "/assets/dealership-showroom.png",
      imgMobile: "/assets/dealership-showroom.png",
      desc: "Spotless showroom floors, polished glass facades, and meticulous detail sanitizing to reflect the premium quality of your brand.",
      cta: "Get a Quote \u2192"
    },
    campuses: {
      title: "Universities & Campuses",
      subtitle: 'High-Frequency <span class="sub-accent">Disinfection</span> of Lecture Halls',
      img: "/assets/campus-disinfection.png",
      imgMobile: "/assets/campus-disinfection.png",
      desc: "High-frequency disinfection of classrooms, labs, lecture halls, and student centers to promote a safe and healthy campus experience.",
      cta: "Get a Quote \u2192"
    }
  };

  const restorationDamageInfo = {
    water: {
      title: "Water Damage",
      subtitle: 'Rapid <span class="sub-accent">Extraction</span> &amp; Structural Drying',
      img: "/assets/water_damage_panorama.png",
      imgMobile: "/assets/water_damage_panorama.png",
      desc: "Professional mitigation, extraction, and drying services for floods, pipe bursts, and sewage backups.",
      cta: "Request Help for Water Damage \u2192"
    },
    fire: {
      title: "Fire & Smoke",
      subtitle: 'Thermal <span class="sub-accent">Deodorization</span> &amp; Soot Removal',
      img: "/assets/fire_damage_panorama.png",
      imgMobile: "/assets/fire_damage_panorama.png",
      desc: "Comprehensive soot cleanup, smoke odor elimination, and structural restoration after fire disasters.",
      cta: "Request Help for Fire & Smoke \u2192"
    },
    mold: {
      title: "Mold & Spores",
      subtitle: 'HEPA <span class="sub-accent">Containment</span> &amp; Spore Remediation',
      img: "/assets/mold_remediation_panorama.png",
      imgMobile: "/assets/mold_remediation_panorama.png",
      desc: "Certified containment, air filtration, and safe mold spore elimination to protect building occupants.",
      cta: "Request Help for Mold Remediation \u2192"
    },
    storm: {
      title: "Storm Damage",
      subtitle: 'Emergency <span class="sub-accent">Tarping</span> &amp; Wind Repairs',
      img: "/assets/storm_damage_panorama.png",
      imgMobile: "/assets/storm_damage_panorama.png",
      desc: "Immediate emergency tarping, board-up, and structural stabilization following severe storm events.",
      cta: "Request Help for Storm Damage \u2192"
    },
    hazmat: {
      title: "Hazmat & Asbestos",
      subtitle: 'Certified <span class="sub-accent">Abatement</span> &amp; Chemical Decon',
      img: "/assets/hazmat_abatement_panorama.png",
      imgMobile: "/assets/hazmat_abatement_panorama.png",
      desc: "Licensed containment and removal of biohazards, chemical spills, and hazardous asbestos materials.",
      cta: "Request Help for Hazmat Abatement \u2192"
    },
    trauma: {
      title: "Trauma & Crime Scene",
      subtitle: 'Compassionate <span class="sub-accent">Sanitization</span> &amp; Decontamination',
      img: "/assets/trauma_cleanup_panorama.png",
      imgMobile: "/assets/trauma_cleanup_panorama.png",
      desc: "Discreet, compassionate, and certified decontamination of biohazardous trauma and crime scenes.",
      cta: "Request Help for Trauma Cleanup \u2192"
    },
    rebuild: {
      title: "Full Rebuild",
      subtitle: 'Turnkey <span class="sub-accent">Reconstruction</span> &amp; Remodeling',
      img: "/assets/full_rebuild_panorama.png",
      imgMobile: "/assets/full_rebuild_panorama.png",
      desc: "Full-service general contracting and property reconstruction to restore structures to pre-loss condition.",
      cta: "Request Help for Full Rebuild \u2192"
    }
  };

  const isRestoration = document.querySelector('.hero-damage-pill[data-dmg="water"]') !== null;
  const damageInfo = isRestoration ? restorationDamageInfo : janitorialDamageInfo;
  let activeDmgKey = isRestoration ? "water" : "workspaces";
  let bannersDismissed = false; // Flag to track if we've crossfaded from banners to single image

  let pageInitialized = false;

  let slider = null;

  function updateSliderPosition() {
    if (window.innerWidth <= 1024) {
      if (slider) slider.style.display = 'none';
      return;
    }
    const activePill = document.querySelector('.hero-damage-pill.is-active');
    const damagesRow = document.querySelector('.hero-damages-row');
    if (activePill && slider && damagesRow) {
      slider.style.display = 'block';
      slider.style.left = `${activePill.offsetLeft}px`;
      slider.style.width = `${activePill.offsetWidth}px`;
      slider.style.height = `${activePill.offsetHeight}px`;
      slider.style.top = `${activePill.offsetTop}px`;

      if (activeDmgKey === 'janitorial') {
        slider.classList.add('is-janitorial');
      } else {
        slider.classList.remove('is-janitorial');
      }
    }
  }

  function setupSlider() {
    const damagesRow = document.querySelector('.hero-damages-row');
    if (damagesRow) {
      slider = document.createElement('div');
      slider.className = 'hero-damage-slider';
      damagesRow.appendChild(slider);

      // Position on initial load
      setTimeout(updateSliderPosition, 100);
    }
  }

  function splitTextIntoSpans(text, initialOffset = 0) {
    return text.split('').map((char, idx) => {
      const delay = idx * 25 + initialOffset;
      if (char === ' ') {
        return `<span class="letter letter-space" style="transition-delay: ${delay}ms">&nbsp;</span>`;
      }
      return `<span class="letter" style="transition-delay: ${delay}ms">${char}</span>`;
    }).join('');
  }

  function setActiveService(key) {
    const info = damageInfo[key];
    if (!info) return;
    activeDmgKey = key;

    // Toggle class on the bottom panel for styling overrides (e.g. CTA buttons)
    const bottomPanel = document.querySelector('.hero-bottom-panel');


    // Update dynamic title elements with letter-by-letter stagger reveal
    const titleEls = document.querySelectorAll('.hero-dynamic-title');
    titleEls.forEach(el => {
      el.classList.remove('active');
      const offset = pageInitialized ? 0 : 1000;
      el.innerHTML = splitTextIntoSpans(info.title, offset);
    });
    setTimeout(() => {
      titleEls.forEach(el => {
        el.classList.add('active');
      });
    }, 50);

    // Update dynamic description elements
    const descEls = document.querySelectorAll('.hero-dynamic-desc');
    descEls.forEach(el => {
      el.style.opacity = '0';
    });
    setTimeout(() => {
      descEls.forEach(el => {
        el.textContent = info.desc;
        el.style.opacity = '1';
      });
    }, 150);

    // Update dynamic subtitle elements
    const subEls = document.querySelectorAll('.hero-dynamic-sub');
    subEls.forEach(el => {
      el.style.opacity = '0';
    });
    setTimeout(() => {
      subEls.forEach(el => {
        el.innerHTML = info.subtitle;
        el.style.opacity = '1';
      });
    }, 150);

    // Update dynamic CTA actions
    const ctaEls = document.querySelectorAll('.hero-dynamic-cta');
    ctaEls.forEach(el => {
      el.textContent = info.cta || `Get a Quote \u2192`;
    });

    // Transition from banners to single image on first interaction, otherwise do normal image fade
    const bannersEl = document.querySelector('.hero-banners');
    const imgEl = document.getElementById('hero-main-img');

    if (bannersEl && imgEl) {
      const isMobile = window.innerWidth <= 1024;
      const imageSrc = isMobile ? info.imgMobile : info.img;

      if (!bannersDismissed && key !== 'water') {
        bannersDismissed = true;
        // Cross-fade: fade out load banners, fade in main image
        bannersEl.style.opacity = '0';
        setTimeout(() => {
          bannersEl.style.display = 'none';
        }, 400);

        imgEl.src = imageSrc;
        imgEl.alt = info.title + " Restoration Services";
        imgEl.style.opacity = '1';
        imgEl.style.pointerEvents = 'auto';
      } else if (bannersDismissed) {
        // Normal hover transition on the main image
        imgEl.style.opacity = '0.3';
        imgEl.style.transform = 'scale(1.02)';
        setTimeout(() => {
          imgEl.src = imageSrc;
          imgEl.alt = info.title + " Restoration Services";
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        }, 180);
      }
    }

    // Update active underline state on all matching pills (including clones)
    document.querySelectorAll('.hero-damage-pill').forEach(pill => {
      if (pill.dataset.dmg === key) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    // Update dynamic mobile dropdown trigger label
    const labelEl = document.getElementById('dropdown-trigger-label');
    if (labelEl) {
      labelEl.textContent = info.title;
    }

    // Highlight active item inside the mobile dropdown menu
    document.querySelectorAll('.hero-mobile-dropdown-item').forEach(item => {
      if (item.dataset.dmg === key) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
    pageInitialized = true; // Set initialized flag after first run

    // Dispatch scroll event to force navbar logo & CTA color checks to run immediately
    window.dispatchEvent(new Event('scroll'));

    // Update the slider background position
    if (typeof updateSliderPosition === 'function') {
      updateSliderPosition();
    }
  }

  // Bind mouse and click interactions to all pills (originals and clones)
  function setupPillInteractions() {
    const pills = document.querySelectorAll('.hero-damage-pill');
    pills.forEach(pill => {
      const key = pill.dataset.dmg;
      if (!key) return;

      // Mouse hover swap (desktop)
      pill.addEventListener('mouseenter', () => {
        setActiveService(key);
      });

      // Click / Tap swap (desktop & mobile)
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveService(key);
      });
    });
  }

  // Bind custom dropdown interactions on mobile
  function setupDropdownInteractions() {
    const container = document.querySelector('.hero-mobile-dropdown-container');
    const trigger = document.getElementById('hero-mobile-dropdown-trigger');
    const menu = document.getElementById('hero-mobile-dropdown-menu');
    const items = document.querySelectorAll('.hero-mobile-dropdown-item');

    if (!container || !trigger || !menu) return;

    // Toggle dropdown open/close on trigger click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      container.classList.toggle('is-open');
    });

    // Option selection
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = item.dataset.dmg;
        if (key) {
          setActiveService(key);
        }
        container.classList.remove('is-open');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('is-open');
      }
    });
  }

  // Bind click action to the dynamic CTA to pre-select dropdown & scroll to form
  const dynamicCta = document.getElementById('hero-dynamic-cta');
  if (dynamicCta) {
    dynamicCta.addEventListener('click', (e) => {
      e.preventDefault();

      const select = document.getElementById('contact-service');
      if (select) {
        select.value = activeDmgKey;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initialize showcase and bind actions
  setupSlider();
  setActiveService(activeDmgKey);
  setupPillInteractions();
  setupDropdownInteractions();

  // Re-run setup after a brief timeout to ensure clones are bound
  setTimeout(() => {
    setupPillInteractions();
    updateSliderPosition();
  }, 100);

  window.addEventListener('resize', updateSliderPosition);

  // Auto-cycling for desktop view (every 5 seconds, unless hovering on the damages bar)
  const damageKeys = Object.keys(damageInfo);
  let isHovered = false;

  const damagesBar = document.querySelector('.hero-damages-bar');
  if (damagesBar) {
    damagesBar.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    damagesBar.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  setInterval(() => {
    // Only cycle in desktop view (screen width > 1024px) and when not hovering
    if (window.innerWidth <= 1024 || isHovered) return;

    const currentIndex = damageKeys.indexOf(activeDmgKey);
    const nextIndex = (currentIndex + 1) % damageKeys.length;
    setActiveService(damageKeys[nextIndex]);
  }, 7000);



  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const emailInput = document.getElementById('contact-email');
  const emailError = document.getElementById('email-error-msg');
  const formStatus = document.getElementById('form-status-msg');
  const submitBtn = document.getElementById('form-submit');
  const formFields = contactForm.querySelectorAll('input, select, textarea');

  // Utility to show error on email field
  function showEmailError(msg) {
    emailInput.closest('.form-group').classList.add('has-error');
    emailError.textContent = msg;
    emailError.style.display = 'block';
  }

  // Utility to clear email error
  function clearEmailError() {
    emailInput.closest('.form-group').classList.remove('has-error');
    emailError.textContent = '';
    emailError.style.display = 'none';
  }

  // Utility to show form status (general success or error)
  function showFormStatus(msg, type = 'error') {
    formStatus.textContent = msg;
    formStatus.className = `form-status-msg ${type}`;
    formStatus.style.display = 'block';
  }

  // Utility to clear form status
  function clearFormStatus() {
    formStatus.textContent = '';
    formStatus.style.display = 'none';
  }

  // Dynamic clear on input/typing
  emailInput.addEventListener('input', () => {
    clearEmailError();
    clearFormStatus();
  });

  // Verify email format and domain MX record
  async function validateEmail(email) {
    // 1. Format Regex Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email format (e.g., name@domain.com).' };
    }

    // 2. Extract domain and check DNS MX Record
    const domain = email.split('@')[1];
    try {
      const dnsUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`;
      const response = await fetch(dnsUrl, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });

      if (!response.ok) {
        // If the DNS API fails, we skip this check and let the form submit to be safe
        console.warn('DNS API check failed to respond. Bypassing domain verification.');
        return { valid: true };
      }

      const dnsData = await response.json();

      // Status 0 is NOERROR in DNS. Answer should contain records.
      if (dnsData.Status !== 0 || !dnsData.Answer || dnsData.Answer.length === 0) {
        return { valid: false, message: `The domain "@${domain}" is not a valid email-receiving domain. Please double-check your spelling.` };
      }

      return { valid: true };
    } catch (error) {
      console.error('Error verifying email domain via DNS:', error);
      // Fallback: don't block user if network fails
      return { valid: true };
    }
  }

  // Handle Form Submit
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearEmailError();
    clearFormStatus();

    const email = emailInput.value.trim();
    if (!email) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying email...';
    formFields.forEach(field => field.disabled = true);

    // Validate email format and domain
    const validation = await validateEmail(email);
    if (!validation.valid) {
      showEmailError(validation.message);

      // Re-enable form fields
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      formFields.forEach(field => field.disabled = false);
      return;
    }

    // Prepare form data
    const formData = new FormData(contactForm);

    // Validate Cloudflare Turnstile token
    const turnstileContainer = contactForm.querySelector('.cf-turnstile');
    if (turnstileContainer) {
      const turnstileResponse = formData.get('cf-turnstile-response');
      if (!turnstileResponse) {
        showFormStatus('Please complete the security check.', 'error');

        // Re-enable form fields
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formFields.forEach(field => field.disabled = false);
        return;
      }
    }

    submitBtn.textContent = 'Sending message...';

    try {
      const submitResponse = await fetch(contactForm.action || '/api/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json, text/html'
        }
      });

      if (submitResponse.ok) {
        // If redirected to thank you page, follow it
        if (submitResponse.redirected) {
          window.location.href = submitResponse.url;
        } else {
          // Fallback if no redirect header: redirect manually
          window.location.href = '/thanks';
        }
      } else {
        const errorText = await submitResponse.text();
        let errorMsg = 'An error occurred while sending your message. Please try again.';

        // Try parsing error message if it's simple text
        if (errorText && errorText.length < 200 && !errorText.includes('<html')) {
          errorMsg = errorText;
        }

        showFormStatus(errorMsg, 'error');

        // Re-enable form fields
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formFields.forEach(field => field.disabled = false);

        // Reset turnstile if it exists to allow re-submission
        if (window.turnstile) {
          window.turnstile.reset();
        }
      }
    } catch (err) {
      console.error('Submit connection error:', err);
      showFormStatus('Unable to connect to the server. Please check your internet connection.', 'error');

      // Re-enable form fields
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      formFields.forEach(field => field.disabled = false);

      if (window.turnstile) {
        window.turnstile.reset();
      }
    }
  });

  // Autoplay all videos programmatically on DOM load and user interaction
  const forceAutoplay = () => {
    document.querySelectorAll('video').forEach(video => {
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented, will play on interaction:", error);
        });
      }
    });
  };

  forceAutoplay();
  ['click', 'touchstart', 'scroll'].forEach(evt => {
    document.addEventListener(evt, forceAutoplay, { once: true, passive: true });
  });
});
