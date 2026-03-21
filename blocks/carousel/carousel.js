/* carousel.js — AEM Block */

function buildCarousel(block) {
  // Collect raw slides from block children (each direct child div = one slide)
  const rawSlides = [...block.children];

  // Create track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  rawSlides.forEach((raw) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');

    // First inner div → image container
    const imageDiv = raw.querySelector(':scope > div:first-child');
    if (imageDiv) {
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('carousel-slide-image');
      imageWrapper.append(...imageDiv.childNodes);
      slide.appendChild(imageWrapper);
    }

    // Second inner div (optional) → text container
    const textDiv = raw.querySelector(':scope > div:last-child');
    if (textDiv && textDiv !== imageDiv) {
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('carousel-slide-text');
      textWrapper.append(...textDiv.childNodes);
      slide.appendChild(textWrapper);
    }

    track.appendChild(slide);
    raw.remove();
  });

  block.appendChild(track);

  const totalSlides = track.children.length;
  let currentIndex = 0;

  // --- Navigation buttons ---
  function createNavButton(direction) {
    const btn = document.createElement('button');
    btn.classList.add('carousel-nav', `carousel-nav-${direction}`);
    btn.setAttribute('aria-label', direction === 'prev' ? 'Previous slide' : 'Next slide');
    btn.innerHTML =
      direction === 'prev'
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
    return btn;
  }

  const prevBtn = createNavButton('prev');
  const nextBtn = createNavButton('next');
  block.appendChild(prevBtn);
  block.appendChild(nextBtn);

  // --- Dots ---
  const dotsContainer = document.createElement('div');
  dotsContainer.classList.add('carousel-dots');
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Slide indicators');

  const dots = Array.from({ length: totalSlides }, (_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dotsContainer.appendChild(dot);
    return dot;
  });

  block.appendChild(dotsContainer);

  // --- State update ---
  function goTo(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });

    // Update aria-hidden on slides for accessibility
    [...track.children].forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== currentIndex ? 'true' : 'false');
    });
  }

  // Init
  goTo(0);

  // Button listeners
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Dot listeners
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 40) {
      goTo(delta > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });
}

export default function decorate(block) {
  buildCarousel(block);
}