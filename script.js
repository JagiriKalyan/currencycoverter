const API_KEY = 'f087fa42c62107f7f2d9e282';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const fromCurrencyElement = document.getElementById('fromCurrency');
const toCurrencyElement = document.getElementById('toCurrency');
const amountElement = document.getElementById('amount');
const resultElement = document.getElementById('result');
const convertBtnElement = document.getElementById('convertBtn');

async function loadCurrencies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response data:", data); // Debugging log

        if (!data || !data.conversion_rates) {
            throw new Error("Invalid API response");
        }

        const currencies = Object.keys(data.conversion_rates);
        console.log("Available currencies:", currencies); // Log available currencies

        currencies.forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            fromCurrencyElement.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toCurrencyElement.appendChild(optionTo);
        });
    } catch (error) {
        console.error('Error loading currencies:', error);
    }
}

async function convertCurrency() {
    const amount = parseFloat(amountElement.value);
    const fromCurrency = fromCurrencyElement.value;
    const toCurrency = toCurrencyElement.value;

    if (isNaN(amount) || amount <= 0) {
        resultElement.textContent = "Enter a valid amount";
        return;
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data || !data.conversion_rates) {
            throw new Error("Invalid API response");
        }

        const fromRate = data.conversion_rates[fromCurrency];
        const toRate = data.conversion_rates[toCurrency];

        const convertedAmount = (amount / fromRate) * toRate;
        resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        resultElement.textContent = 'Error fetching currency rates. Please try again later.';
        console.error('Error converting currency:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCurrencies();
    convertBtnElement.addEventListener("click", convertCurrency);
});