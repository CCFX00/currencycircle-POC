import { fetchRate } from "../utils/rates.js";
import { fetchMatchedTrades } from './tradeHandler.js'

// LOAD CREATE OFFERS' PAGE
const selects = document.querySelectorAll(".currency-select");
const exAmount = document.getElementById("ex-amount");
const exValue = document.getElementById("ex-value");
const exRate = document.getElementById("ex-rate");
const matchFee = document.getElementById("match-fee");
const myExFrom = document.getElementById("my-ex-from");
const myExTo = document.getElementById("my-ex-to");
const createOfferButton = document.querySelector(".google-button");

// Attach event listener to offer links
export function linkOffers() {
  const offerLinks = document.querySelectorAll(".offer-link");
  offerLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const offerId = this.getAttribute("data-offer-id");
      fetchMatchedTrades(`http://localhost:5000/trade/${offerId}`);
    });
  });
}

// Submitting the offer
export async function submitOffer() {
  const base = document.getElementById("base").value;
  const quote = document.getElementById("quote").value;

  const offerData = {
    from: base,
    to: quote,
    amount: exAmount.value,
    value: exValue.value,
    rate: exRate.value,
  };

  try {
    const response = await fetch("http://localhost:5000/offer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerData),
    });

    await response.json();
    window.location.href = "/user";
  } catch (error) {
    console.error("Error:", error);
  }
}

function calculateValues() {
  const amount = parseFloat(exAmount.value) || 0;
  const rate = parseFloat(exRate.value) || 1;
  const value = amount * rate;
  exValue.value = Math.round(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  matchFee.textContent = `$${(exAmount.value * 0.005).toFixed(2)} match fee`;
}

if (exAmount && exRate && createOfferButton) {
  exAmount.addEventListener("input", calculateValues);
  exRate.addEventListener("input", calculateValues);
  createOfferButton.addEventListener("click", submitOffer);
}

function updateFlag(select) {
  const flagIcon = select.parentElement.querySelector(".flag-icon");
  const selectedOption = select.options[select.selectedIndex];
  const flagSrc = selectedOption.getAttribute("data-flag");
  flagIcon.src = flagSrc;
  flagIcon.alt = `${selectedOption.text} Flag`; // Update alt attribute to the country's name
}

selects.forEach((select) => {
  updateFlag(select); // Update the flag when the page loads

  select.addEventListener("change", handleSelectChange);
});

function handleSelectChange() {
  updateFlag(this);
  const base = document.getElementById("base").value;
  const quote = document.getElementById("quote").value;
  myExFrom.textContent = base;
  myExTo.textContent = quote;
  fetchRate(base, quote);
}
