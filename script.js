// Fetch prices from CoinGecko API
async function fetchPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd,php');
    const data = await response.json();
    return data['pi-network'];
  } catch (error) {
    console.error('Error fetching prices:', error);
    return null;
  }
}

// Update price displays based on input
async function updatePrices() {
  const prices = await fetchPrices();
  if (prices) {
    const piAmount = parseFloat(document.getElementById('pi-input').value) || 0;
    const usdValue = (piAmount * prices.usd).toFixed(2);
    const phpValue = (piAmount * prices.php).toFixed(2);
    document.getElementById('usd-output').textContent = usdValue;
    document.getElementById('php-output').textContent = phpValue;
  }
}

// Initial price update
updatePrices();

// Auto-update every 5 seconds
setInterval(updatePrices, 5000);

// Update prices on input change
document.getElementById('pi-input').addEventListener('input', updatePrices);

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

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500);
  }
});
