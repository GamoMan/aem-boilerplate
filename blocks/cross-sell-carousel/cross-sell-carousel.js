/**
 * Decorates cross-sell-carousel block.
 * Rotates images inside the second column every 3 seconds.
 * @param {Element} block
 */
export default async function decorate(block) {
  // Ensure block has a class for styling
  block.classList.add('cross-sell-carousel');

  const columns = block.querySelectorAll('div');
  if (columns.length < 2) return;
  const imageContainer = columns[1];
  const pictures = Array.from(imageContainer.querySelectorAll('picture'));
  if (pictures.length === 0) return;

  let index = 0;
  const show = (i) => {
    pictures.forEach((p, idx) => {
      p.style.display = idx === i ? 'block' : 'none';
    });
  };
  show(index);

  // Simple interval rotation
  setInterval(() => {
    index = (index + 1) % pictures.length;
    show(index);
  }, 3000);
}
