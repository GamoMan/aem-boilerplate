/**
 * loads and decorates the quote block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Get all paragraphs within the block
  const paragraphs = block.querySelectorAll('p');

  if (paragraphs.length === 0) {
    return;
  }

  // Create the quote container
  const quoteContainer = document.createElement('blockquote');
  quoteContainer.className = 'quote-text';

  // Move paragraphs into the blockquote
  paragraphs.forEach((p) => {
    quoteContainer.appendChild(p.cloneNode(true));
  });

  // Clear the block and add the decorated element
  block.innerHTML = '';
  block.appendChild(quoteContainer);
}
