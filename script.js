const themeButton = document.getElementById("themeToggle");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  if (themeButton) {
    themeButton.textContent = isDark ? "Light mode" : "Dark mode";
    themeButton.setAttribute("aria-pressed", String(isDark));
  }
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

if (themeButton) {
  themeButton.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");

function weatherKey() {
  return typeof CONFIG !== "undefined" ? CONFIG.weatherKey : "";
}

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.textContent = "Please enter a city.";
    return;
  }

  const apiKey = weatherKey();
  if (!apiKey) {
    weatherResult.textContent =
      "Add a weatherKey in config.js to enable live weather.";
    return;
  }

  weatherButton.disabled = true;
  weatherResult.textContent = "Loading weather...";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    encodeURIComponent(apiKey) +
    "&units=metric";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "HTTP " + response.status);
    }

    weatherResult.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = data.name + (data.sys && data.sys.country ? ", " + data.sys.country : "");

    const temperature = document.createElement("p");
    temperature.textContent = "Temperature: " + Math.round(data.main.temp) + "°C (Feels like " + Math.round(data.main.feels_like) + "°C)";

    const condition = document.createElement("p");
    condition.textContent = "Condition: " + (data.weather[0]?.description || "N/A");

    const humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    const wind = document.createElement("p");
    wind.textContent = "Wind Speed: " + data.wind.speed + " m/s";

    weatherResult.append(heading, temperature, condition, humidity, wind);
  } catch (error) {
    weatherResult.textContent = "Weather error: " + error.message;
  } finally {
    weatherButton.disabled = false;
  }
}

if (weatherButton && cityInput && weatherResult) {
  weatherButton.addEventListener("click", getWeather);
  cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
}

const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

function getAssistantReply(question) {
  const q = question.toLowerCase();

  if (/\b(hi|hello|hey|greetings)\b/.test(q)) {
    return "Hello! Welcome to Rudra Rathor's portfolio. Ask me about his projects, technical skills, GitHub repositories, or how to get in touch.";
  }

  if (q.includes("who are you") || q.includes("your name")) {
    return "I am the interactive on-page assistant for Rudra Rathor's portfolio.";
  }

  if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
    return "Rudra's core skills include HTML5, modern CSS, JavaScript (ES6+), Git & GitHub, and Python.";
  }

  if (q.includes("project") || q.includes("work") || q.includes("built")) {
    return "Rudra's GitHub repositories include: 1) Quiz Application, 2) Book Reading List App, 3) Developer Portfolio, 4) Python Program Collection, 5) Messy Python Code Improvement, 6) Fixing Buggy Python Script, and 7) Python Basics Factorial Program.";
  }

  if (q.includes("quiz")) {
    return "The Quiz Application is an interactive web quiz engine built with HTML, CSS, and JavaScript. You can view the code at github.com/rudrarathor730-beep/quiz or test the live demo at quiz-rudhra2.vercel.app.";
  }

  if (q.includes("reading") || q.includes("book") || q.includes("bookmark")) {
    return "The Book Reading List App (bookmark) tracks reading lifecycles (Want to Read, Currently Reading, Completed) with localStorage and live search. Repo: github.com/rudrarathor730-beep/bookmark | Live demo: bookmark-rudhra2.vercel.app.";
  }

  if (q.includes("python") || q.includes("factorial") || q.includes("fibonacci") || q.includes("buggy") || q.includes("messy")) {
    return "Rudra's Python repositories feature Python Program Collection (factorials, fibonacci, dictionaries), Messy Python Code Improvement (refactoring to PEP 8), Fixing Buggy Python Script (debugging & testing), and Python Basics Factorial Program.";
  }

  if (q.includes("github") || q.includes("repo") || q.includes("code")) {
    return "You can explore Rudra's GitHub repositories at @rudrarathor730-beep (https://github.com/rudrarathor730-beep).";
  }

  if (q.includes("about") || /\brudra\b/.test(q) || q.includes("bio")) {
    return "Rudra Rathor is a Computer Science developer focused on building clean web applications, dependable Python tools, and modern software architectures.";
  }

  if (q.includes("weather")) {
    return "You can use the Weather Telemetry card in the Lab section above to look up live weather conditions for any city!";
  }

  if (q.includes("dark") || q.includes("theme") || q.includes("light") || q.includes("mode")) {
    return "Toggle dark or light mode using the 'Dark mode' button located in the top navigation bar. Your choice is saved locally.";
  }

  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire") || q.includes("gmail")) {
    return "You can email Rudra directly at rudrarathor730@gmail.com, or check out his GitHub at https://github.com/rudrarathor730-beep.";
  }

  return "Feel free to ask about Rudra, his skills, projects, GitHub (@rudrarathor730-beep), or email (rudrarathor730@gmail.com).";
}

function addChatMessage(role, message) {
  const bubble = document.createElement("p");
  bubble.className =
    "chat-message " + (role === "You" ? "chat-user" : "chat-assistant");
  bubble.textContent = role + ": " + message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const question = userInput.value.trim();

  if (!question) {
    chatStatus.textContent = "Please type a question first.";
    return;
  }

  addChatMessage("You", question);
  addChatMessage("Assistant", getAssistantReply(question));
  chatStatus.textContent = "";
  userInput.value = "";
  userInput.focus();
}

if (sendButton && userInput && chatMessages && chatStatus) {
  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}

const projectSearch = document.getElementById("projectSearch");
const projectCards = document.querySelectorAll(".project-card");
const projectSearchStatus = document.getElementById("projectSearchStatus");

function filterProjects() {
  if (!projectSearch || !projectSearchStatus) {
    return;
  }

  const term = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach(function (card) {
    const matches = card.textContent.toLowerCase().includes(term);
    card.hidden = !matches;
    if (matches) {
      visibleCount += 1;
    }
  });

  if (term === "") {
    projectSearchStatus.textContent = "";
  } else if (visibleCount === 0) {
    projectSearchStatus.textContent = "No projects match that search.";
  } else {
    projectSearchStatus.textContent = visibleCount + " project(s) found.";
  }
}

if (projectSearch && projectSearchStatus) {
  projectSearch.addEventListener("input", filterProjects);
}
