/* ====================================================================
   HARMONY MOMENTS · script.js
   ====================================================================
   All behaviour for the single-page site. Vanilla JS, no dependencies.

   CONTENTS
   01. EXPERIENCES DATA         <- edit packages here (name, copy, image)
   02. Render experience cards
   03. Mobile navigation
   04. Header scroll state
   05. Fade-in on scroll
   06. Analytics & conversion tracking (dataLayer + gtag/fbq hooks)
   07. Image fallbacks (branded gradient if a file is missing)
   ==================================================================== */

(function () {
  'use strict';

  /* ==================================================================
     01. EXPERIENCES DATA
     ------------------------------------------------------------------
     The three packages are rendered from this array. To change a
     package (or add a fourth), edit ONLY this data — the card markup
     is generated automatically in section 02.

     Fields:
       name      display name of the experience
       tagline   short italic line under the name
       description  one-paragraph pitch
       details   bullet list of inclusions
       image     filename of the 4:3 card photo (in the site root)
       imageAlt  descriptive alt text for accessibility/SEO
       slug      short id used in analytics events (no spaces)
     ================================================================== */
  var EXPERIENCES = [
    {
      name: 'The Intimate',
      tagline: 'For two.',
      price: 'From $200',
      description: 'A romantic golden-hour setup for two — date nights, proposals and anniversaries.',
      details: [
        'Styled low table & cushions',
        'Candles & styled details',
        'Grazing-ready styling',
        'Choice of Sydney park or your space'
      ],
      image: 'package-intimate.webp',
      imageAlt: 'Intimate picnic setting for two with facing place settings, a small posy, two candles and glasses of sparkling wine',
      slug: 'intimate'
    },
    {
      name: 'The Celebration',
      tagline: 'For your favourite people.',
      price: 'From $300',
      description: 'An elevated setup for birthdays and celebrations of 4\u20136 guests. Completely stress-free.',
      details: [
        'Seating & styling for up to 6',
        'Personalised touches',
        'Candles & d\u00e9cor',
        'Grazing table styling available'
      ],
      image: 'package-celebration.webp',
      imageAlt: 'Long celebration picnic table styled for six with pastel florals, candles and an abundant grazing spread',
      slug: 'celebration'
    },
    {
      name: 'At-Home Hosting',
      tagline: 'We come to you.',
      price: 'On enquiry',
      description: 'Your backyard or living room, transformed \u2014 set up and packed down entirely by us.',
      details: [
        'Backyard or indoor styling',
        'Fully set up & packed down',
        'Tailored to your occasion',
        'Add-ons on request'
      ],
      image: 'package-athome.webp',
      imageAlt: 'Backyard at dusk styled with a low picnic table, glowing string lights, candles and florals',
      slug: 'athome'
    }
  ];


  /* ==================================================================
     02. RENDER EXPERIENCE CARDS
     Builds one card per entry in EXPERIENCES and injects them into
     #experience-cards. Each card ends with a clay "Enquire" button
     that scrolls to the contact section and is tracked (section 06).
     ================================================================== */
  function renderExperiences() {
    var mount = document.getElementById('experience-cards');
    if (!mount) return;

    var html = EXPERIENCES.map(function (exp, i) {
      var delay = i === 1 ? ' delay-1' : (i === 2 ? ' delay-2' : '');
      return (
        '<article class="experience-card fade-in' + delay + '">' +
          '<figure class="frame frame-landscape" data-label="' + exp.name + '">' +
            '<img src="' + exp.image + '" alt="' + exp.imageAlt + '" loading="lazy">' +
          '</figure>' +
          '<div class="experience-body">' +
            '<h3 class="experience-name">' + exp.name + '</h3>' +
            '<p class="experience-tagline">' + exp.tagline + '</p>' +
            (exp.price ? '<p class="experience-price">' + exp.price + '</p>' : '') +
            '<p class="experience-desc">' + exp.description + '</p>' +
            '<ul class="experience-details">' +
              exp.details.map(function (d) { return '<li>' + d + '</li>'; }).join('') +
            '</ul>' +
            '<a href="#contact" class="btn btn-clay" data-enquiry-cta data-cta-location="experience_' + exp.slug + '">Enquire</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    mount.innerHTML = html;
  }


  /* ==================================================================
     02b. EXPERIENCE CAROUSEL DOTS (mobile only)
     The experience grid becomes a horizontal swipe carousel on phones
     (see styles.css section 25). These dots show position and allow
     tapping to a card. On desktop the CSS hides them.
     ================================================================== */
  function initExperienceDots() {
    var track = document.getElementById('experience-cards');
    if (!track) return;
    var cards = track.querySelectorAll('.experience-card');
    if (cards.length < 2) return;

    var dots = document.createElement('div');
    dots.className = 'experience-dots';
    dots.setAttribute('aria-label', 'Experience navigation');
    for (var i = 0; i < cards.length; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to experience ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      (function (idx) {
        b.addEventListener('click', function () {
          var card = cards[idx];
          /* Scroll only the track (scrollIntoView can also move the
             page vertically in some browsers). */
          track.scrollTo({
            left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
            behavior: 'smooth'
          });
        });
      })(i);
      dots.appendChild(b);
    }
    track.insertAdjacentElement('afterend', dots);

    /* Highlight the dot of whichever card is most in view. Scroll
       listener + IntersectionObserver: some browsers are unreliable
       with one or the other on snap carousels, so use both. */
    var buttons = dots.querySelectorAll('button');
    function setActive(idx) {
      idx = Math.max(0, Math.min(cards.length - 1, idx));
      buttons.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === idx);
      });
    }
    track.addEventListener('scroll', function () {
      var pitch = track.scrollWidth / cards.length;
      setActive(Math.round(track.scrollLeft / pitch));
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      var cardList = Array.prototype.slice.call(cards);
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(cardList.indexOf(entry.target));
        });
      }, { root: track, threshold: 0.6 });
      cardList.forEach(function (c) { observer.observe(c); });
    }
  }


  /* ==================================================================
     03. MOBILE NAVIGATION (hamburger toggle)
     ================================================================== */
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    /* Close the menu when a link inside it is tapped */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    /* Close on Escape for keyboard users */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }


  /* ==================================================================
     04. HEADER SCROLL STATE (adds a soft shadow once scrolled)
     ================================================================== */
  function initHeaderShadow() {
    var header = document.getElementById('site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ==================================================================
     05. FADE-IN ON SCROLL
     Elements with .fade-in slide/fade into place when they enter the
     viewport. Falls back to "always visible" for old browsers and
     for users who prefer reduced motion.
     ================================================================== */
  function initFadeIns() {
    var items = document.querySelectorAll('.fade-in');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);            /* animate once */
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* ==================================================================
     06. ANALYTICS & CONVERSION TRACKING
     ------------------------------------------------------------------
     Two kinds of tracked clicks:

     a) CHANNEL clicks  [data-enquiry-method="instagram|whatsapp|email"]
        The actual conversion — someone opening a messaging channel.
        Pushes: { event: 'enquiry_click', method: '<channel>' }
        >>> Optimise your ad campaigns toward THIS event. <<<

     b) CTA clicks      [data-enquiry-cta] + data-cta-location
        Intent — an "Enquire Now" button that scrolls to #contact.
        Pushes: { event: 'enquiry_click', method: 'cta_button',
                  cta_location: 'hero' | 'nav' | ... }
        Useful for funnel analysis (which CTA placements work).

     The dataLayer pushes are LIVE now. The gtag/fbq calls below are
     commented placeholders — uncomment them (and install the matching
     tags in index.html <head>) when your ad accounts are ready.
     ================================================================== */
  /* Safe GA4 event sender. gtag() is defined inline in index.html, so
     it exists even when an ad-blocker stops the external gtag.js — this
     just becomes a harmless no-op. Never throws, never breaks a button. */
  /* Which page are we on? Set by build.js as <body data-page-id="...">.
     Every event below is stamped with it, so in GA4 you can tell a
     WhatsApp click on the Proposals page from one on the home page. */
  var PAGE_ID = (document.body && document.body.getAttribute('data-page-id')) || 'home';

  function gaEvent(name, params) {
    if (typeof window.gtag !== 'function') return;
    params = params || {};
    if (params.page_id === undefined) params.page_id = PAGE_ID;
    try { window.gtag('event', name, params); } catch (e) {}
  }

  /* Google Ads conversion labels. The base tag (AW-18341896172) is
     configured once in index.html <head>. Each entry fires exactly one
     conversion per user action via the click/submit handlers below. */
  var ADS_CONV = {
    form:      'AW-18341896172/hBHRCMTI8NUcEOy_jKpE',
    call:      'AW-18341896172/JaqHCOeR9NUcEOy_jKpE',
    whatsapp:  'AW-18341896172/uitwCMCX9NUcEOy_jKpE',
    instagram: 'AW-18341896172/WRl4CICcgtYcEOy_jKpE',
    email:     'AW-18341896172/axZQCKSZ5tscEOy_jKpE'
  };
  /* Relative worth of a lead from each page, in AUD. A Google Ads
     conversion carries no "which page" field — the name shown in Tag
     Assistant comes from the Ads UI, not from here — so VALUE is how we
     tell Ads that a proposal enquiry is worth more than a date-night one.
     Without it every conversion counts as 1 and the bidding chases
     whichever occasion is cheapest to convert.

     These are the STARTING PRICE of each occasion, used as a relative
     weight. They are potential booking value, not revenue — a WhatsApp
     click is not a booking — so read "conv. value" in Ads as a
     weighted lead score, not as money earned. */
  var PAGE_VALUE = {
    proposal_page:      499,
    baby_shower_page:   300,
    bridal_shower_page: 300,
    date_night_page:    200,
    anniversary_page:   200,
    birthday_page:      200
  };
  var DEFAULT_VALUE = 200;                          /* home, journal, terms */

  /* Guard against the same conversion firing twice for one action (e.g. a
     double-tap, or a click that bubbles through nested handlers). Ads
     counts each hit, so a duplicate inflates the numbers the bidding
     learns from. Belt and braces: also set Count = "One" on each
     conversion action in the Ads UI. */
  var lastConv = {};
  function adsConversion(kind) {
    if (typeof window.gtag !== 'function') return;
    if (!ADS_CONV[kind]) return;                    /* unknown kind → no-op */
    var now = Date.now();
    if (lastConv[kind] && now - lastConv[kind] < 2000) return;
    lastConv[kind] = now;
    try {
      window.gtag('event', 'conversion', {
        send_to:  ADS_CONV[kind],
        value:    PAGE_VALUE[PAGE_ID] || DEFAULT_VALUE,
        currency: 'AUD'
      });
    } catch (e) {}
  }

  /* Rough device check, used to tag contact clicks. Matters because
     tel: and mailto: links usually do nothing on a desktop, so a
     desktop "Call" click is a dead end, not a lead. */
  function isProbablyMobile() {
    return window.matchMedia('(max-width: 767px)').matches ||
           /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  }

  function pushEnquiryEvent(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    /* ---- GA4 event (uncomment when GA4 tag is installed) ----------
    if (typeof gtag === 'function') {
      gtag('event', 'enquiry_click', {
        method: payload.method,
        cta_location: payload.cta_location || undefined
      });
    }
    ---------------------------------------------------------------- */

    /* ---- Google Ads conversion (uncomment + add your label) -------
       Fire ONLY for channel clicks so Ads optimises toward real
       enquiries, not button scrolls.
    if (typeof gtag === 'function' && payload.method !== 'cta_button') {
      gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXX/YOUR_CONVERSION_LABEL'
      });
    }
    ---------------------------------------------------------------- */

    /* ---- Meta / Instagram Pixel Lead (uncomment when Pixel live) --
    if (typeof fbq === 'function' && payload.method !== 'cta_button') {
      fbq('track', 'Lead', { content_name: payload.method });
    }
    ---------------------------------------------------------------- */
  }

  function initTracking() {
    /* a) Channel buttons: Instagram / WhatsApp / Email */
    document.querySelectorAll('[data-enquiry-method]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var method = el.getAttribute('data-enquiry-method');
        pushEnquiryEvent({ event: 'enquiry_click', method: method });

        /* GA4: contact_click — only true messaging channels, not the
           form submit button (which also carries data-enquiry-method).
           These links open in a new tab, so the event has time to send. */
        if (method === 'whatsapp' || method === 'instagram' || method === 'email' || method === 'call') {
          /* GA4: a distinctly-named event per channel (e.g.
             contact_click_whatsapp) so you can tell at a glance WHICH
             button was pressed, plus device — a tel:/mailto: click on
             desktop often does nothing, so device explains dead ends. */
          var device = isProbablyMobile() ? 'mobile' : 'desktop';
          gaEvent('contact_click_' + method, {
            method: method, device: device, send_to: 'G-Q6NQ8PB2GM'
          });
          /* Keep the generic event too, so totals stay comparable. */
          gaEvent('contact_click', {
            method: method, device: device, send_to: 'G-Q6NQ8PB2GM'
          });

          /* Google Ads conversion — one per contact channel
             (call / whatsapp / instagram / email). */
          adsConversion(method);
        }

        /* Placeholder guard: while href="#" (links not yet replaced),
           stop the browser opening a blank tab / jumping to top.
           This block becomes inert once real URLs are in place. */
        if (el.getAttribute('href') === '#') {
          e.preventDefault();
          console.warn('Harmony Moments: replace this href="#" with your real ' +
            el.getAttribute('data-enquiry-method') + ' link (see index.html comments).');
        }
      });
    });

    /* b) "Enquire Now" CTAs that scroll to the contact section */
    document.querySelectorAll('[data-enquiry-cta]').forEach(function (el) {
      el.addEventListener('click', function () {
        var loc = el.getAttribute('data-cta-location') || 'unknown';
        pushEnquiryEvent({ event: 'enquiry_click', method: 'cta_button', cta_location: loc });

        /* GA4: every Enquire/Book button → enquire_click with its section */
        gaEvent('enquire_click', { location: loc, send_to: 'G-Q6NQ8PB2GM' });

        /* GA4: package-card Enquire buttons ALSO fire package_interest.
           data-cta-location is "experience_intimate" | "_celebration"
           | "_athome" → normalise to intimate | celebration | at_home. */
        if (loc.indexOf('experience_') === 0) {
          var pkg = loc.slice('experience_'.length);
          if (pkg === 'athome') pkg = 'at_home';
          gaEvent('package_interest', { package: pkg, send_to: 'G-Q6NQ8PB2GM' });
        }
      });
    });
  }


  /* ==================================================================
     06b. ENQUIRY FORM
     Toggle: reveal/hide the collapsible form.
     Submit: AJAX POST to Netlify (URL-encoded), then show the inline
     thanks card and hide the form. Falls back to a normal form POST
     if fetch() is unavailable.
     ================================================================== */
  function initEnquiryForm() {
    var form   = document.getElementById('enquiry-form');
    var thanks = document.querySelector('.enquiry-thanks');
    var errEl  = form ? form.querySelector('.enquiry-error') : null;
    if (!form) return;

    /* ---- Form engagement funnel (GA4) --------------------------------
       Reveals the gap between "saw the form" and "sent it":
         form_start   — first time they touch any field (once)
         form_abandon — they started but left without submitting,
                        reporting the last field they reached
       Together with generate_lead you can see exactly where people
       give up. Uses visibilitychange (not beforeunload) because it is
       far more reliable for firing analytics as a page is left. */
    var formStarted = false, formSubmitted = false, lastField = '';
    form.addEventListener('focusin', function (e) {
      var name = e.target && e.target.name;
      if (!name || name === 'bot-field') return;
      lastField = name;
      if (!formStarted) {
        formStarted = true;
        gaEvent('form_start', { send_to: 'G-Q6NQ8PB2GM' });
      }
    });
    /* form_submit_attempt — fires on every press of Send, INCLUDING when
       HTML5 validation then blocks the submit. Listening on the button
       (not the form's submit event) is what makes those blocked attempts
       visible; otherwise a person stopped by a validation error is
       completely invisible in analytics. Compare against generate_lead:
       the gap is people who tried to send and couldn't. */
    var attemptBtn = form.querySelector('.enquiry-submit');
    if (attemptBtn) {
      attemptBtn.addEventListener('click', function () {
        var ok = form.checkValidity ? form.checkValidity() : true;
        gaEvent('form_submit_attempt', {
          valid: ok ? 'yes' : 'no',
          send_to: 'G-Q6NQ8PB2GM'
        });
        if (!ok) {
          /* Named separately so blocked submits are obvious at a glance */
          var firstBad = form.querySelector(':invalid');
          gaEvent('form_validation_blocked', {
            field: (firstBad && firstBad.name) || 'unknown',
            send_to: 'G-Q6NQ8PB2GM'
          });
        }
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'hidden') return;
      if (formStarted && !formSubmitted) {
        formSubmitted = true;                        /* report once only */
        gaEvent('form_abandon', { last_field: lastField || 'unknown', send_to: 'G-Q6NQ8PB2GM' });
      }
    });

    if (!('fetch' in window)) return;              /* let default POST happen */

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errEl) errEl.hidden = true;
      var submitBtn = form.querySelector('.enquiry-submit');
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      formSubmitted = true;          /* stops a false form_abandon later */

      /* Push analytics event so form enquiries show in the same
         dataLayer stream as CTA clicks (see section 06). */
      pushEnquiryEvent({ event: 'enquiry_click', method: 'form' });

      var body = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);

        /* GA4: generate_lead — the real conversion. Include the chosen
           occasion so you can see which occasion types convert. */
        var occ = form.querySelector('[name="occasion"]');
        gaEvent('generate_lead', { occasion: occ && occ.value ? occ.value : undefined, send_to: 'G-Q6NQ8PB2GM' });

        /* Google Ads conversion: Enquiry Form Submitted (Primary) */
        adsConversion('form');

        form.hidden = true;
        var heading = document.querySelector('.enquiry-heading');
        if (heading) heading.hidden = true;
        if (thanks) thanks.hidden = false;
      })
      .catch(function () {
        /* GA4: the form failed to send — a silent lead-killer worth
           knowing about, since the visitor tried and got an error. */
        gaEvent('form_error', { send_to: 'G-Q6NQ8PB2GM' });
        if (errEl) errEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
    });
  }


  /* ==================================================================
     07. IMAGE FALLBACKS
     If an image file is missing (e.g. photos not yet dropped into the
     folder), hide the broken <img> and show the frame's sage-to-cream
     gradient with its centred data-label description instead. The
     page therefore always looks intentional. To fix a placeholder,
     simply add the correctly named .jpg next to index.html.
     ================================================================== */
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(function (img) {
      function fail() {
        var frame = img.closest('.frame');
        img.style.display = 'none';
        if (frame) frame.classList.add('is-fallback');
        /* The hero has its own gradient background, so hiding the img
           is enough there. */
      }
      if (img.complete && img.naturalWidth === 0 && img.src) {
        fail();                                          /* already failed */
      } else {
        img.addEventListener('error', fail);
      }
    });
  }


  /* ==================================================================
     08. GALLERY LIGHTBOX
     Click (or keyboard-activate) any gallery image to open an enlarged
     view with previous/next navigation. Closes on the X button, the
     backdrop, or Escape; arrow keys step between images. The overlay
     markup is built once and reused. Only the real gallery grid is
     wired up — the decorative Instagram strip is left untouched.
     ================================================================== */
  function initGalleryLightbox() {
    var frames = Array.prototype.slice.call(
      document.querySelectorAll('.gallery-grid .frame')
    );
    if (!frames.length) return;

    var items = frames.map(function (frame) {
      var img = frame.querySelector('img');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? (img.getAttribute('alt') || '') : '',
        label: frame.getAttribute('data-label') || ''
      };
    });

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Gallery image viewer');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close image">&#215;</button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>' +
      '<figure class="lightbox-stage">' +
        '<img class="lightbox-img" src="" alt="">' +
        '<figcaption class="lightbox-caption"></figcaption>' +
      '</figure>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('.lightbox-img');
    var capEl = overlay.querySelector('.lightbox-caption');
    var current = 0;
    var lastFocus = null;

    function show(i) {
      current = (i + items.length) % items.length;      /* wrap around */
      var it = items[current];
      imgEl.setAttribute('src', it.src);
      imgEl.setAttribute('alt', it.alt);
      capEl.textContent = it.label;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      overlay.querySelector('.lightbox-close').focus();
      /* GA4 flow event: which gallery image they enlarged */
      gaEvent('gallery_open', { image: items[i].label || ('image_' + (i + 1)), send_to: 'G-Q6NQ8PB2GM' });
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    frames.forEach(function (frame, i) {
      frame.classList.add('is-zoomable');
      frame.setAttribute('role', 'button');
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('aria-label', 'View ' + (items[i].label || 'image') + ' larger');
      frame.addEventListener('click', function () { open(i); });
      frame.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    overlay.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

    /* Click on the dim backdrop (or the stage padding) closes it */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lightbox-stage')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  }


  /* ==================================================================
     09. FLOW ANALYTICS (GA4)
     Traces how a visitor moves through the page so you can see the
     journey in GA4, not just the final conversion. All GA4-only, and
     each fires ONCE per page load (no repeated events as someone
     scrolls up and down) so reports stay clean.
       section_view  — each section the first time it scrolls into view
       faq_open      — each FAQ question the first time it's expanded
     (gallery_open is fired from the lightbox, section 08.)
     ================================================================== */
  function initFlowAnalytics() {
    /* a) Section views — the scroll journey through the page.
       rootMargin shrinks the viewport's bottom 40%, so a section counts
       as "viewed" once its top scrolls into the upper 60% of the screen.
       This fires reliably for sections taller than the screen (e.g. the
       gallery), which a percentage threshold cannot. */
    if ('IntersectionObserver' in window) {
      var seen = {};
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          if (!id || seen[id]) return;
          seen[id] = true;                           /* once per section */
          /* Readable analytics names for every section. The DOM id stays
             short for anchor links; this map gives GA4 a human-friendly
             name so you read "section_view_proposal_page_about_us"
             instead of "section_view_proposals_about". */
          var SECTION_NAMES = {
            'about':           'about_us',
            'contact':         'contact_form',
            'included':        'whats_included',
            'cta-band':        'cta_band',
            'how-it-works':    'how_it_works',
            'more-occasions':  'other_occasions',
            'experience-cards':'experience_cards',
            'occasions':       'occasions_grid',
            'journal-list':    'journal_list',
            'post':            'article',
            'terms':           'terms_content'
          };
          var safe = SECTION_NAMES[id] || id.replace(/-/g, '_');
          gaEvent('section_view_' + PAGE_ID + '_' + safe, {
            page: PAGE_ID, section: safe, send_to: 'G-Q6NQ8PB2GM'
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -40% 0px' });
      /* The footer is included so the scroll journey has an end point:
         section_view_<page>_footer means "read the whole page". */
      document.querySelectorAll('main > section[id], footer[id]').forEach(function (s) {
        obs.observe(s);
      });
    }

    /* b) Exits — where people go when they leave the site. GA4's
       automatic outbound tracking hides the destination in a hard-to-read
       parameter, so name the event after the destination host instead
       (e.g. exit_to_instagram_com). Delegated, so it also covers links
       added later. */
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' || href === '') return;      /* in-page */
      var host = '';
      try {
        var u = new URL(href, window.location.href);
        if (u.protocol === 'tel:' || u.protocol === 'mailto:') return;  /* covered by contact_click */
        if (u.hostname === window.location.hostname) return;            /* internal */
        host = u.hostname.replace(/^www\./, '');
      } catch (err) { return; }
      if (!host) return;
      gaEvent('exit_to_' + host.replace(/[^a-zA-Z0-9]/g, '_'), {
        destination: host, url: href.slice(0, 100), send_to: 'G-Q6NQ8PB2GM'
      });
    }, true);

    /* b2) Reviews — fires once when the reviews block is actually seen,
       with how many are shown. Social proof is the biggest lever on this
       site, so it gets its own event rather than only section_view. */
    var reviewsEl = document.getElementById('reviews');
    if (reviewsEl && 'IntersectionObserver' in window) {
      var rSeen = false;
      var rObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || rSeen) return;
          rSeen = true;
          gaEvent('reviews_seen', {
            count: reviewsEl.querySelectorAll('.review-card').length,
            send_to: 'G-Q6NQ8PB2GM'
          });
          rObs.disconnect();
        });
      }, { threshold: 0, rootMargin: '0px 0px -30% 0px' });
      rObs.observe(reviewsEl);
    }

    /* c) Occasion card clicks — which occasion pages people go to from
       the home page. Named per occasion so the interest is obvious. */
    document.querySelectorAll('[data-occasion]').forEach(function (card) {
      card.addEventListener('click', function () {
        var occ = card.getAttribute('data-occasion') || 'unknown';
        gaEvent('occasion_click_' + occ, { occasion: occ, send_to: 'G-Q6NQ8PB2GM' });
      });
    });

    /* c2) Journal article clicks. These are internal links, so the exit
       tracker in (b) deliberately skips them — without this, blog
       traffic looks like it goes nowhere. Named per article so you can
       see which posts actually pull people further into the site. */
    document.querySelectorAll('.journal-teaser-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var slug = (card.getAttribute('href') || '')
          .replace(/^\/journal\//, '').replace(/\/$/, '').replace(/-/g, '_') || 'unknown';
        gaEvent('journal_click_' + slug, { article: slug, send_to: 'G-Q6NQ8PB2GM' });
      });
    });

    /* d) Review buttons (journal pages only — deliberately kept off the
       ad landing pages so paid traffic isn't sent off-site). */
    document.querySelectorAll('[data-review]').forEach(function (el) {
      el.addEventListener('click', function () {
        var kind = el.getAttribute('data-review');      /* read | write */
        gaEvent('review_' + kind + '_click', { send_to: 'G-Q6NQ8PB2GM' });
      });
    });

    /* e) FAQ opens — which questions visitors actually care about */
    var faqSeen = {};
    document.querySelectorAll('.faq-item').forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;                      /* only on expand */
        var summary = item.querySelector('summary');
        var label = summary ? summary.textContent.trim() : 'faq';
        if (faqSeen[label]) return;                  /* once per question */
        faqSeen[label] = true;
        gaEvent('faq_open', { question: label, send_to: 'G-Q6NQ8PB2GM' });
      });
    });
  }



  /* ==================================================================
     10. REVIEW "READ MORE"
     Reviews are clamped to a few lines so the section stays compact on
     a phone; tapping expands the full quote in place.
     ================================================================== */
  function initReviewToggles() {
    var pairs = [];

    document.querySelectorAll('.review-more').forEach(function (btn) {
      var card = btn.closest('.review-card');
      var quote = card && card.querySelector('.review-quote');
      if (!quote) return;
      pairs.push({ btn: btn, card: card, quote: quote });

      btn.addEventListener('click', function () {
        var open = card.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Read less' : 'Read more';
        if (open) gaEvent('review_expand', { send_to: 'G-Q6NQ8PB2GM' });
      });
    });

    /* A "Read more" on a review that isn't actually clamped is a dead
       control, so hide it. Measured rather than assumed, because whether
       a quote overflows depends on the viewport and the loaded font. */
    function sync() {
      pairs.forEach(function (p) {
        if (p.card.classList.contains('is-expanded')) return;   /* user opened it */
        p.btn.hidden = p.quote.scrollHeight <= p.quote.clientHeight + 4;
      });
    }

    sync();
    /* Re-measure once the web font is in: it changes line heights, and so
       can change whether a quote overflows at all. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sync).catch(function () {});
    }
    /* Crossing the mobile breakpoint adds or removes the clamp entirely. */
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(sync, 150);
    });
  }

  /* ==================================================================
     BOOT — order matters: cards must exist before fade-ins/tracking
     attach to them.
     ================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    renderExperiences();
    initExperienceDots();
    initNav();
    initHeaderShadow();
    initFadeIns();
    initTracking();
    initEnquiryForm();
    initImageFallbacks();
    initGalleryLightbox();
    initFlowAnalytics();
    initReviewToggles();
  });
})();
