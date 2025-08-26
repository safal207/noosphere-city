// This script assumes that localization.js has already run and populated window.i18nData

// Таймер обратного отсчёта
const countdown = document.getElementById("countdown");
const END_DATE_KEY = 'noosphere_countdown_end';

let targetDate = localStorage.getItem(END_DATE_KEY);
if (!targetDate) {
  targetDate = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem(END_DATE_KEY, targetDate);
}
targetDate = parseInt(targetDate);

function updateCountdown() {
  const now = Date.now();
  let diff = targetDate - now;
  if (diff < 0) diff = 0;
  const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
  const minutes = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, '0');
  const seconds = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
  countdown.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Обработка формы с honeypot
document.getElementById("signalForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = (window.i18nData && window.i18nData.js_sending) || "Sending…";

  const payload = {
    name: document.getElementById("name").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    message: document.getElementById("message").value.trim(),
    website: this.website.value // honeypot поле
  };

  try {
    const resp = await fetch("https://noosphere-server.vercel.app/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      document.getElementById("successMessage").style.display = "block";
      this.reset();
      btn.textContent = (window.i18nData && window.i18nData.js_sent) || "Sent ✅";
    } else {
      throw new Error((window.i18nData && window.i18nData.js_error) || "❌ Error sending. Please try again later.");
    }
  } catch (error) {
    alert(error.message);
    btn.disabled = false;
    btn.textContent = (window.i18nData && window.i18nData.button_submit) || "Send a signal";
    return;
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = (window.i18nData && window.i18nData.button_submit) || "Send a signal";
    document.getElementById("successMessage").style.display = "none";
  }, 28000);
});
