(() => {
  'use strict';

  // A downloaded review copy can also be opened directly in a browser.
  if (location.protocol === 'file:') {
    for (const link of document.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (/^(?:\.\.\/)+[a-z-]*\/?$/.test(href)) link.setAttribute('href', href + 'index.html');
    }
  }

  const measurementId = 'G-51PRRH8Y3M';
  const {pageType, guideId} = document.documentElement.dataset;
  const context = guideId ? {page_type: pageType, guide_id: guideId} : {page_type: pageType};
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  // Preview interactions must not alter the live property's visitor counts.
  if (location.hostname !== 'arielesc.github.io') window['ga-disable-' + measurementId] = true;
  gtag('js', new Date());
  gtag('config', measurementId, context); // The configuration sends the initial page_view.
  function track(event, parameters = {}) {
    gtag('event', event, {...context, ...parameters});
  }

  function buttonLocation(element) {
    if (element.dataset.location) return element.dataset.location;
    if (element.closest('.hero,header')) return 'hero';
    if (element.closest('.final,footer')) return 'footer';
    return 'middle';
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const location = {button_location: buttonLocation(link)};
    if (link.dataset.event) track(link.dataset.event, location);
    if (pageType === 'home' && link.dataset.guide) {
      track('guide_card_click', {...location, guide_id: link.dataset.guide.replace(/-/g, '_')});
    }
    if (['instagram.com', 'www.instagram.com'].includes(link.hostname)) track('instagram_click', location);
  });

  for (const faq of document.querySelectorAll('details')) {
    faq.addEventListener('toggle', () => {
      if (faq.open) track('faq_open', {question: faq.querySelector('summary').textContent.trim()});
    });
  }

  const thresholds = [25, 50, 75, 90];
  let nextThreshold = 0;
  let pendingFrame = false;
  function checkDepth() {
    pendingFrame = false;
    const documentHeight = document.documentElement.scrollHeight;
    const bottom = window.scrollY + window.innerHeight;
    const depth = 100 * bottom / documentHeight;
    while (nextThreshold < thresholds.length && depth >= thresholds[nextThreshold]) {
      track('scroll_depth', {scroll_percentage: thresholds[nextThreshold++]});
    }
  }
  function scheduleDepthCheck() {
    if (pendingFrame || nextThreshold === thresholds.length) return;
    pendingFrame = true;
    requestAnimationFrame(checkDepth);
  }
  window.addEventListener('load', scheduleDepthCheck);
  window.addEventListener('scroll', scheduleDepthCheck, {passive: true});
  window.addEventListener('resize', scheduleDepthCheck);

  const modal = document.getElementById('purchaseModal');
  if (!modal) return;
  const form = modal.querySelector('#purchaseForm');
  const status = modal.querySelector('#purchaseStatus');
  const submit = form.querySelector('button[type=submit]');
  const defaultLabel = submit.textContent;
  status.tabIndex = -1;
  status.setAttribute('role', 'status');
  let opener;
  let started = false;
  let submitted = false;
  let previousOverflow;

  function close() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    opener.focus({preventScroll: true});
  }
  document.querySelectorAll('[data-purchase-open]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      if (modal.classList.contains('open')) return;
      opener = button;
      const parameters = {button_location: buttonLocation(button)};
      track('purchase_click', parameters);
      previousOverflow = document.body.style.overflow;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      (submitted ? status : form.querySelector('input:not([type=hidden])')).focus();
      track('purchase_modal_open', parameters);
    });
  });
  modal.querySelectorAll('[data-purchase-close]').forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not(:disabled), input:not([type=hidden])')]
      .filter(element => element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === status)) {
      event.preventDefault(); first.focus();
    }
  });
  function markStarted() {
    if (started) return;
    started = true;
    track('form_start', {button_location: buttonLocation(opener)});
  }
  form.addEventListener('input', markStarted);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || submitted) return;
    markStarted();
    const parameters = {button_location: buttonLocation(opener)};
    const payload = new FormData(form);
    payload.set('guide_id', guideId);
    submit.disabled = true;
    submit.textContent = 'שולח...';
    try {
      const response = await fetch(form.action, {method: 'POST', body: payload, headers: {Accept: 'application/json'}});
      if (!response.ok) throw new Error('Submission rejected');
      submitted = true;
      form.classList.add('hidden');
      status.classList.add('show');
      if (modal.classList.contains('open')) status.focus();
      track('purchase_lead_submitted', parameters);
    } catch {
      submit.disabled = false;
      submit.textContent = defaultLabel;
      window.alert('לא הצלחנו לשלוח כרגע. נסו שוב בעוד רגע.');
    }
  });
})();
