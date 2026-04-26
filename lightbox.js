(function () {
  const groupSelectors = [
    '.nature-strip',
    '.feature-scroll',
    '.gallery-grid',
    '.links-hero-scroll'
  ];
  const imageSelector = groupSelectors.map((selector) => `${selector} img`).join(',') + ', .amenity-card.image-card img';
  const images = Array.from(document.querySelectorAll(imageSelector));
  if (!images.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image">×</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <img class="lightbox-image" alt="" />
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(overlay);

  const lightboxImage = overlay.querySelector('.lightbox-image');
  const caption = overlay.querySelector('.lightbox-caption');
  const close = overlay.querySelector('.lightbox-close');
  const prev = overlay.querySelector('.lightbox-prev');
  const next = overlay.querySelector('.lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function getGroup(img) {
    const container = groupSelectors.map((selector) => img.closest(selector)).find(Boolean);
    if (!container) return [img];
    return Array.from(container.querySelectorAll('img'));
  }

  function render() {
    const img = currentGroup[currentIndex];
    if (!img) return;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Riverside Garden Villa photo';
    caption.textContent = img.alt || '';
    const showNav = currentGroup.length > 1;
    prev.hidden = !showNav;
    next.hidden = !showNav;
  }

  function openLightbox(img) {
    currentGroup = getGroup(img);
    currentIndex = Math.max(0, currentGroup.indexOf(img));
    render();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lightbox-lock');
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');
    document.documentElement.classList.remove('lightbox-lock');
  }

  function go(delta) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    render();
  }

  images.forEach((img) => {
    img.classList.add('is-zoomable');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt || 'Photo') + '. Open larger view');
    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  close.addEventListener('click', closeLightbox);
  prev.addEventListener('click', (event) => { event.stopPropagation(); go(-1); });
  next.addEventListener('click', (event) => { event.stopPropagation(); go(1); });
  lightboxImage.addEventListener('click', (event) => event.stopPropagation());
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  });

  let touchStartX = null;
  overlay.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const diff = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 48) go(diff > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });
})();
