const API_KEY = "YOUR_API_KEY_HERE";

let requestCount = 0;

const form = document.getElementById("inputForm");
const numberInput = document.getElementById("numberInput");
const outputDiv = document.getElementById("output");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  requestCount++;

  console.log("Request count:", requestCount);

  if (requestCount > 10) {
    const captchaSection = document.getElementById("captchaSection");
    if (captchaSection) {
      captchaSection.style.display = "block";
      alert("Erreur 403: Trop de requêtes. Veuillez résoudre le CAPTCHA.");
    } else {
      console.error("Element with ID 'captchaSection' not found.");
    }
    return;
  }

  const N = parseInt(numberInput.value);

  if (isNaN(N) || N < 1 || N > 1000) {
    alert("Please enter a valid number between 1 and 1000.");
    return;
  }

  outputDiv.innerHTML = "";
  form.style.display = "none";

  let currentIndex = 1;

  const fetchSequence = async () => {
    if (currentIndex > N) {
      return;
    }

    try {
      const response = await fetch("https://api.prod.jcloudify.com/whoami", {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        outputDiv.innerHTML += `${currentIndex}. ${
          data.message || "Response received"
        }<br>`;
      } else {
        outputDiv.innerHTML += `${currentIndex}. Forbidden<br>`;
        if (response.status === 403) {
          outputDiv.innerHTML += `CAPTCHA detected. Please solve it to continue.<br>`;
          await waitForCaptcha();
        }
      }
    } catch (error) {
      console.error("Error fetching:", error);
      outputDiv.innerHTML += `${currentIndex}. Forbidden<br>`;
    }

    currentIndex++;
    outputDiv.scrollTop = outputDiv.scrollHeight;
    setTimeout(fetchSequence, 1000);
  };

  fetchSequence();
});

async function waitForCaptcha() {
  return new Promise((resolve) => {
    const captchaInterval = setInterval(() => {
      if (isCaptchaResolved()) {
        clearInterval(captchaInterval);
        requestCount = 10;
        resolve();
      }
    }, 1000);
  });
}

function isCaptchaResolved() {
  return document.getElementById("captchaResolved")?.checked;
}
