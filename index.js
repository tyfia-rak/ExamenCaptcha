const API_KEY =
  "QFYeykBdQKdBtLhvHuK+hlH19ZxKrOLx3L6WUx+qRpfh9vMYAJdYb2oxcpE5KTBfEhmqrrhEvRVeODIZAQEnIOTQqqG/j6FUGLohcKveATIuOWDePxGmPOdcu4NLMCWwCg8dGdatkqKZlUhos2yl3DGIuUL4JVhlpmvPN5Li8WUQXFptUmZqBZupowmVQ+Sb82O/zdObyaLVdjNnlXe02zWpeepFsOxUqk2nVJGN0RCEgH+OG8t5bdeLm4lKFoBQa4wAh5oVpJ8ErwhZNgdkLKqbwYX4cUGWHtOAcjRYcY1wxY/T8CXm6TG3tRwqbWmdGN0jvg9rVqpSPTFI7uwyVDxTtP5PAMBqMh4OZbwbidupU2OAw8wMGiHVj67ekOMI6dfq+7rZq/QcQJYjsEzMMNeA6hkj0Em8f8GUCpSIhSmPcgTqGt/bi3g/bkSwkNNaYQnu+X0GYKHH/fm88SJHUKVxvMb4TFBi7PDTDFH0qoXrbd4Z25D1mveDTjO0D65McMVwyg5CQlifCfGDmlSTSpgEHJ3uRPSYeF6ueJo8JGufYRv9HwAd1zKyHsASV2DmYT/p9dXFrNRqp9OmYM1lmqjdwLLibJ5mKF28B1Ku2sDg93UM1CBTgsDw9lsXOmccYSzVHUfbUL8C+qUJZ1cDZP34kEwbt/q+f9eWtD26vzQ=_0_1";

const form = document.getElementById("inputForm");
const numberInput = document.getElementById("numberInput");
const outputDiv = document.getElementById("output");

let requestCount = 0;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  requestCount++;

  if (requestCount > 10) {
    const captchaSection = document.getElementById("captchaSection");
    captchaSection.style.display = "block";

    alert("Erreur 403: Trop de requêtes. Veuillez résoudre le CAPTCHA.");
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
          Authorization: `Bearer ${API_KEY}`, // Ajoutez l'API_KEY si nécessaire
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
          await waitForCaptcha(); // Attendre que l'utilisateur résolve le CAPTCHA
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
        requestCount = 10; // Réinitialise le compteur pour permettre la poursuite des requêtes
        resolve(); // Continuez lorsque le CAPTCHA est résolu
      }
    }, 1000); // Vérifiez toutes les secondes
  });
}

function isCaptchaResolved() {
  return document.getElementById("captchaResolved")?.checked; // Vérifiez si le CAPTCHA a été résolu
}
