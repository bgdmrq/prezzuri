/**
 * Extracts the weight from a given text string.
 * @param {string} text - The text containing the weight information.
 * @returns {number|null} - The weight in kilograms or null if not found.
 */
function extractWeight(text) {
  const weightRegex = /(\d+)\s*(g|kg)/i;
  const match = text.match(weightRegex);
  if (!match) return null;

  let weight = parseFloat(match[1]);
  if (match[2].toLowerCase() === "g") {
    weight /= 1000;
  }
  return weight;
}

/**
 * Extracts the price from a given text string.
 * @param {string} text - The text containing the price information.
 * @returns {number} - The price as a floating-point number.
 */
function extractPrice(text) {
  const sanitizedText = text.replace(",", ".").replace("RON", "").trim();
  return parseFloat(sanitizedText);
}

/**
 * Appends the calculated price per kg to the given price element.
 * Skips if the price element already contains the price per kg.
 * @param {Element} priceElement - The DOM element to append the price per kg.
 * @param {number} pricePerKg - The calculated price per kg.
 */
function appendPricePerKg(priceElement, pricePerKg) {
  if (/kg/i.test(priceElement.textContent)) return;

  const pricePerKgElement = document.createElement("p");
  pricePerKgElement.textContent = `${pricePerKg.toFixed(2)} RON / Kg`;
  priceElement.appendChild(pricePerKgElement);
}

/**
 * Processes each product on the page to calculate and display the price per kg.
 */
function processProducts() {
  const productSelector = ".col-product-listing-box:not(.processed)";
  const products = document.querySelectorAll(productSelector);

  products.forEach((product) => {
    product.classList.add("processed");

    const weightElement = product.querySelector(".bringo-product-name");
    const priceElement = product.querySelector(".bringo-product-price");

    const weight = extractWeight(weightElement.textContent);
    const price = extractPrice(priceElement.textContent);

    if (weight && price) {
      const pricePerKg = price / weight;
      appendPricePerKg(priceElement, pricePerKg);
    }
  });
}

// Initialize MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(processProducts);
observer.observe(document.body, { childList: true, subtree: true });

// Perform initial processing
processProducts();
