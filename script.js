// Currency list with codes (includes THB and VND from previous request)
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
setInterval(() => updatePrices(true), 30000);

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

// Pi info modal
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

// QR code enlarge on tap
const qrCode = document.querySelector('.qr-code');
const qrModal = document.getElementById('qr-modal');
const qrCloseBtn = document.querySelector('.qr-close');
qrCode.addEventListener('click', () => {
  qrModal.style.display = 'block';
});
qrCloseBtn.addEventListener('click', () => {
  qrModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === qrModal) {
    qrModal.style.display = 'none';
  }
});

// Candlestick Chart Setup with Plotly.js
function generateMockData(timeframe) {
  const now = new Date();
  const data = { x: [], open: [], high: [], low: [], close: [] };
  let basePrice = 1.5; // Mock starting price in USD
  const timeStep = timeframe === '1h' ? 60 * 60 * 1000 : timeframe === '24h' ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const points = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : 30;

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now - i * (timeStep / points));
    const open = basePrice + Math.random() * 0.1 - 0.05;
    const close = open + Math.random() * 0.1 - 0.05;
    const high = Math.max(open, close) + Math.random() * 0.05;
    const low = Math.min(open, close) - Math.random() * 0.05;
    data.x.push(time);
    data.open.push(open);
    data.high.push(high);
    data.low.push(low);
    data.close.push(close);
    basePrice = close;
  }
  return data;
}

function updateChart(timeframe) {
  const data = generateMockData(timeframe);
  const trace = {
    x: data.x,
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close,
    type: 'candlestick',
    increasing: { line: { color: '#00cc00' } }, // Green for up
    decreasing: { line: { color: '#ff0000' } }  // Red for down
  };

  const layout = {
    title: 'Pi Network Price (USD)',
    xaxis: {
      type: 'date',
      range: [data.x[0], data.x[data.x.length - 1]],
      rangeslider: { visible: false }
    },
    yaxis: { title: 'Price (USD)' },
    height: 400,
    margin: { t: 50, b: 50, l: 50, r: 50 }
  };

  Plotly.newPlot('price-chart', [trace], layout);
}

// Toggle button functionality
const buttons = {
  '1h': document.getElementById('one-hour-btn'),
  '24h': document.getElementById('one-day-btn'),
  '1m': document.getElementById('one-month-btn')
};

function setActiveButton(timeframe) {
  Object.values(buttons).forEach(btn => btn.classList.remove('active'));
  buttons[timeframe].classList.add('active');
}

Object.keys(buttons).forEach(timeframe => {
  buttons[timeframe].addEventListener('click', () => {
    setActiveButton(timeframe);
    updateChart(timeframe);
  });
});

// Initial chart load
updateChart('1h');
setActiveButton('1h');
