// Currency list with codes
const currencies = [
  { code: "PHP", name: "Philippine Peso" },
  { code: "KRW", name: "South Korean Won" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" }
];
let selectedIndex = 0; // Default to PHP (index 0)

// Fetch prices from CoinGecko API
async function fetchPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd,php,krw,ngn,jpy,hkd,inr,gbp');
    const data = await response.json();
    return data['pi-network'];
  } catch (error) {
    console.error('Error fetching prices:', error);
    return null;
  }
}

// Update price displays
async function updatePrices(fromPi = true) {
  const prices = await fetchPrices();
  if (prices) {
    const piInput = document.getElementById('pi-input');
    const usdInput = document.getElementById('usd-output');
    const selectedOutput = document.getElementById('selected-output');
    const selectedCurrency = currencies[selectedIndex].code.toLowerCase();

    if (fromPi) {
      // Update USD and selected currency based on Pi input
      const piAmount = parseFloat(piInput.value) || 0;
      usdInput.value = (piAmount * prices.usd).toFixed(2);
      selectedOutput.textContent = (piAmount * prices[selectedCurrency]).toFixed(2);
    } else {
      // Update Pi and selected currency based on USD input
      const usdAmount = parseFloat(usdInput.value) || 0;
      piInput.value = (usdAmount / prices.usd).toFixed(6);
      selectedOutput.textContent = (usdAmount / prices.usd * prices[selectedCurrency]).toFixed(2);
    }
  }
}

// Initial price update
updatePrices();
setInterval(() => updatePrices(true), 30000); // Auto-update from Pi every 30 seconds

// Update prices on Pi input change
document.getElementById('pi-input').addEventListener('input', () => updatePrices(true));

// Update prices on USD input change
document.getElementById('usd-output').addEventListener('input', () => updatePrices(false));

// Search functionality
document.getElementById('currency-search').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const match = currencies.findIndex(c => c.name.toLowerCase().includes(searchTerm) || c.code.toLowerCase().includes(searchTerm));
  if (match !== -1) {
    selectedIndex = match;
    document.getElementById('selected-currency').textContent = `${currencies[selectedIndex].code}: `;
    updatePrices(true);
  }
});

// Up/Down button functionality
document.getElementById('up-btn').addEventListener('click', () => {
  selectedIndex = (selectedIndex - 1 + currencies.length) % currencies.length;
  document.getElementById('selected-currency').textContent = `${currencies[selectedIndex].code}: `;
  updatePrices(true);
});

document.getElementById('down-btn').addEventListener('click', () => {
  selectedIndex = (selectedIndex + 1) % currencies.length;
  document.getElementById('selected-currency').textContent = `${currencies[selectedIndex].code}: `;
  updatePrices(true);
});

// Toggle dark mode
const toggleButton = document.querySelector('.dark-mode-toggle');
const moonIcon = document.querySelector('.moon');
const sunIcon = document.querySelector('.sun');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline';
  } else {
    moonIcon.style.display = 'inline';
    sunIcon.style.display = 'none';
  }
});

// Handle modal display
const logo = document.querySelector('.logo');
const modal = document.getElementById('pi-modal');
const closeBtn = document.querySelector('.close');
logo.addEventListener('click', () => {
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
});
closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500);
  }
});
