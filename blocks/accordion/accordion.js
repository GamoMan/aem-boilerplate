/**
 * loads and decorates the accordion block
 * @param {Element} block The accordion block element
 */
export default async function decorate(block) {
  // Iterate over each child div (which represents an accordion item)
  [...block.children].forEach((row) => {
    // Ensure the row has at least two children for title and content
    if (row.children.length < 2) {
      // Handle cases where there aren't enough children, perhaps log a warning or skip
      console.warn('Accordion row does not have enough children for title and content:', row);
      return;
    }

    const titleDiv = row.children[0];
    const contentDiv = row.children[1];

    // Create button for the accordion title
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `accordion-content-${titleDiv.id || Math.random().toString(36).substring(2, 9)}`);
    button.classList.add('accordion-header');
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('accordion-item-title');
    titleContainer.innerHTML = titleDiv.innerHTML;
    button.append(titleContainer);

    // Create content panel
    const contentPanel = document.createElement('div');
    contentPanel.id = button.getAttribute('aria-controls');
    contentPanel.classList.add('accordion-content');
    contentPanel.setAttribute('aria-hidden', 'true');
    contentPanel.innerHTML = contentDiv.innerHTML;

    // Wrap button and content in a new div for the accordion item
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordionItem.append(button, contentPanel);

    // Replace the original row with the new accordion item structure
    row.replaceWith(accordionItem);

    // Add click event listener to toggle accordion
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      contentPanel.setAttribute('aria-hidden', String(isExpanded));
      accordionItem.classList.toggle('is-open', !isExpanded);
    });
  });

  // Ensure the first item is open by default, if desired. For now, all closed.
  // This can be modified if a requirement for initial open state is introduced.
}
