// Currency list with codes
const currencies = [
  { code: "PHP", name: "Philippine Peso" },
  { code: "KRW", name: "South Korean Won" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "THB", name: "Thai Baht" },
  { code: "VND", name: "Vietnamese Dong" }
];
let selectedIndex = 0; // Default to PHP

// Fetch current price from CoinGecko API
async function fetchPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd,php,krw,ngn,jpy,hkd,inr,gbp,idr,sgd,aed,sar,thb,vnd');
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
      const piAmount = parseFloat(piInput.value) || 0;
      usdInput.value = (piAmount * prices.usd).toFixed(2);
      selectedOutput.textContent = (piAmount * prices[selectedCurrency]).toFixed(2);
    } else {
      const usdAmount = parseFloat(usdInput.value) || 0;
      piInput.value = (usdAmount / prices.usd).toFixed(6);
      selectedOutput.textContent = (usdAmount / prices.usd * prices[selectedCurrency]).toFixed(2);
    }
  }
}

// Initial price update
updatePrices();
setInterval(updatePrices, 30000);

// Event listeners for price inputs
document.getElementById('pi-input').addEventListener('input', () => updatePrices(true));
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

// Dark mode toggle
const toggleButton = document.querySelector('.dark-mode-toggle');
const moonIcon = document.querySelector('.moon');
const sunIcon = document.querySelector('.sun');
const darkText = document.querySelector('.mode-text');
const lightText = document.querySelector('.light-text');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline';
    darkText.style.display = 'none';
    lightText.style.display = 'inline';
  } else {
    moonIcon.style.display = 'inline';
    sunIcon.style.display = 'none';
    darkText.style.display = 'inline';
    lightText.style.display = 'none';
  }
  // Force style recalculation
  document.body.style.display = 'none';
  setTimeout(() => {
    document.body.style.display = '';
  }, 10);
});

// Pi info modal
const logo = document.querySelector('.logo');
const piModal = document.getElementById('pi-modal');
const closeBtn = document.querySelector('.close');
logo.addEventListener('click', () => {
  piModal.style.display = 'block';
  setTimeout(() => piModal.classList.add('show'), 10);
});
closeBtn.addEventListener('click', () => {
  piModal.classList.remove('show');
  setTimeout(() => piModal.style.display = 'none', 500);
});
window.addEventListener('click', (event) => {
  if (event.target === piModal) {
    piModal.classList.remove('show');
    setTimeout(() => piModal.style.display = 'none', 500);
  }
});

// QR code modal
function showQRModal() {
  const qrModal = document.getElementById('qr-modal');
  qrModal.style.display = 'block';
  setTimeout(() => qrModal.classList.add('show'), 10);
}

const qrCloseBtn = document.querySelector('.qr-close');
qrCloseBtn.addEventListener('click', () => {
  const qrModal = document.getElementById('qr-modal');
  qrModal.classList.remove('show');
  setTimeout(() => qrModal.style.display = 'none', 500);
});
window.addEventListener('click', (event) => {
  const qrModal = document.getElementById('qr-modal');
  if (event.target === qrModal) {
    qrModal.classList.remove('show');
    setTimeout(() => qrModal.style.display = 'none', 500);
  }
});

// Line Graph Setup with Chart.js
const ctx = document.getElementById('price-chart').getContext('2d');
let chart;

async function fetchChartData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/pi-network/market_chart?vs_currency=usd&days=30&interval=daily');
    const data = await response.json();
    return data.prices.map(([timestamp, price]) => ({ x: new Date(timestamp), y: price }));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

async function updateChart() {
  const data = await fetchChartData();
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Pi Network Price (USD) - 1 Month',
        data: data,
        borderColor: 'var(--accent-color)',
        backgroundColor: 'rgba(241, 196, 15, 0.2)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Date', color: 'var(--text-color)' } },
        y: { title: { display: true, text: 'Price (USD)', color: 'var(--text-color)' } }
      },
      plugins: { legend: { display: true, labels: { color: 'var(--text-color)' } } }
    }
  });
}

// Initial chart load
updateChart();
