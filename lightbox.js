(function () {
  const selectors = [
    '.nature-strip img',
    '.feature-scroll img',
    '.gallery-grid img',
    '.links-hero-scroll img',
    '.amenity-card.image-card img'
  ];

  const images = Array.from(document.querySelectorAll(selectors.join(',')));
  if (!images.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image">×</button>
    <img class="lightbox-image" alt="" />
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(overlay);

  const lightboxImage = overlay.querySelector('.lightbox-image');
  const caption = overlay.querySelector('.lightbox-caption');
  const close = overlay.querySelector('.lightbox-close');

  function openLightbox(img) {
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Riverside Garden Villa photo';
    caption.textContent = img.alt || '';
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
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });
})();
