/**
 * AEM Block – Carousel
 * Features:
 *  - Mouse / touch drag to change slide (momentum-based)
 *  - Prev / Next arrow buttons
 *  - Navigation dots
 *  - Title + description animate in on each active slide
 *  - Nav hidden when only 1 slide
 */

function buildCarousel(block) {
  /* ── collect slides ────────────────────────────────────────────── */
  const rows = [...block.children];
  if (rows.length === 0) return;

  /* ── build DOM ─────────────────────────────────────────────────── */
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  const slides = rows.map((row, i) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');

    /* image cell (always first) */
    const imgCell = cells[0];
    if (imgCell) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'carousel-image';
      imgWrap.innerHTML = imgCell.innerHTML;
      slide.append(imgWrap);
    }

    /* content cell (optional second cell) */
    const contentCell = cells[1];
    if (contentCell) {
      const content = document.createElement('div');
      content.className = 'carousel-content';
      content.innerHTML = contentCell.innerHTML;

      const title = content.querySelector('h1,h2,h3,h4,h5,h6');
      if (title) title.className = 'slide-title';

      const descs = [...content.querySelectorAll('p')];
      descs.forEach((p) => {
        if (!p.querySelector('a')) p.classList.add('slide-desc');
      });

      slide.append(content);
    }

    track.append(slide);
    return slide;
  });

  wrapper.append(track);

  /* ── nav buttons ───────────────────────────────────────────────── */
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn--prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn--next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  nav.append(prevBtn, nextBtn);

  /* ── dots ──────────────────────────────────────────────────────── */
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dotsWrap.append(dot);
    return dot;
  });

  wrapper.append(nav, dotsWrap);

  /* ── replace block content ─────────────────────────────────────── */
  block.innerHTML = '';
  block.append(wrapper);

  /* ── hide nav when single slide ────────────────────────────────── */
  if (slides.length <= 1) {
    nav.style.display = 'none';
    dotsWrap.style.display = 'none';
  }

  /* ── state ─────────────────────────────────────────────────────── */
  let current = 0;
  let isAnimating = false;

  /* ── animate content in ────────────────────────────────────────── */
  function triggerContentAnimation(slide) {
    const title = slide.querySelector('.slide-title');
    const desc = slide.querySelector('.slide-desc');

    title.classList.remove('title-visible');
    desc.classList.remove('desc-visible');
    if (title) {
      // eslint-disable-next-line no-unused-expressions
      void title.offsetWidth; // reflow
      setTimeout(() => title.classList.add('title-visible'), 0);
    }
    if (desc) {
      desc.classList.remove('desc-visible');
      void desc.offsetWidth; // reflow
      setTimeout(() => desc.classList.add('desc-visible'), 0);
    }
  }

  /* ── go-to ─────────────────────────────────────────────────────── */
  function goTo(index, immediate = false) {
    if (isAnimating && !immediate) return;
    if (slides.length <= 1) return;

    const prev = current;
    current = ((index % slides.length) + slides.length) % slides.length;

    if (prev === current && !immediate) return;

    isAnimating = true;

    const offset = -current * 100;
    track.style.transition = immediate
      ? 'none'
      : 'transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)';
    track.style.transform = `translateX(${offset}%)`;

    slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== current ? 'true' : 'false'));

    dots[prev]?.classList.remove('is-active');
    dots[current]?.classList.add('is-active');

    if (immediate) {
      isAnimating = false;
      triggerContentAnimation(slides[current]);
    } else {
      track.addEventListener(
        'transitionend',
        () => {
          isAnimating = false;
          triggerContentAnimation(slides[current]);
        },
        { once: true },
      );
    }
  }

  /* ── button listeners ──────────────────────────────────────────── */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  /* ── drag / swipe (mouse + touch) ──────────────────────────────── */
  let dragStartX = null;
  let dragDelta = 0;
  let isDragging = false;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;

  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  function onDragStart(e) {
    if (slides.length <= 1) return;
    dragStartX = getX(e);
    dragDelta = 0;
    isDragging = true;
    velocity = 0;
    lastX = dragStartX;
    lastTime = Date.now();
    track.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging || dragStartX === null) return;
    const x = getX(e);
    dragDelta = x - dragStartX;

    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) velocity = (x - lastX) / dt;
    lastX = x;
    lastTime = now;

    const baseOffset = -current * 100;
    const dragPercent = (dragDelta / track.offsetWidth) * 100;
    const isAtStart = current === 0 && dragDelta > 0;
    const isAtEnd = current === slides.length - 1 && dragDelta < 0;
    const drag = isAtStart || isAtEnd ? dragPercent * 0.3 : dragPercent;

    track.style.transform = `translateX(${baseOffset + drag}%)`;

    if (e.cancelable) e.preventDefault();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const threshold = track.offsetWidth * 0.18;
    const momentumThreshold = 0.4; // px/ms

    if (Math.abs(velocity) > momentumThreshold) {
      goTo(velocity < 0 ? current + 1 : current - 1);
    } else if (dragDelta < -threshold) {
      goTo(current + 1);
    } else if (dragDelta > threshold) {
      goTo(current - 1);
    } else {
      track.style.transition = 'transform 0.35s cubic-bezier(0.77, 0, 0.175, 1)';
      track.style.transform = `translateX(${-current * 100}%)`;
    }

    dragStartX = null;
    dragDelta = 0;
  }

  /* mouse */
  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  /* touch */
  track.addEventListener('touchstart', onDragStart, { passive: true });
  track.addEventListener('touchmove', onDragMove, { passive: false });
  track.addEventListener('touchend', onDragEnd);

  /* prevent image ghost-drag */
  track.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

  /* ── keyboard ──────────────────────────────────────────────────── */
  block.setAttribute('tabindex', '0');
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── initial state ─────────────────────────────────────────────── */
  track.style.transform = 'translateX(0%)';
  triggerContentAnimation(slides[0]);
}

export default function decorate(block) {
  buildCarousel(block);
}
