import { getLLMFeedback } from "./llmHandler.js"; 

console.log("Popup loaded");

async function fetchOrLoadContractData(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId },
      function: extractTerms
    }, (results) => {
      const data = results[0]?.result;

      if (!data || Object.keys(data).length === 0) {
        console.log("No live data found, using stored data.");
        const stored = localStorage.getItem("contractData");
        resolve(stored ? JSON.parse(stored) : {});
      } else {
        console.log("Saving live data to localStorage.");
        localStorage.setItem("contractData", JSON.stringify(data));
        resolve(data);
      }
    });
  });
}

document.getElementById("scrapeBtn").addEventListener("click", async () => {
  console.log("Scrape button clicked");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await fetchOrLoadContractData(tab.id);

  console.log("Received data:", data);
  displaySummary(data);

  const feedback = await getLLMFeedback(data);
  console.log("LLM Feedback:", feedback);
  displayLLMFeedback(feedback);
});

function extractTerms() {
  const categories = {
    "Voice & Data Ownership": ["voice ownership", "data rights", "data ownership", "retain rights"],
    "AI Use of Recordings": ["ai training", "ai use", "machine learning", "reuse recordings", "synthesized voice"],
    "Compensation": ["payment", "rate", "fee", "compensation", "per hour", "per project"],
    "Payment Timeline & Dispute": ["payment timeline", "pay within", "net 30", "dispute resolution", "payment dispute"],
    "Buy-Outs and Licensing": ["buy-out", "license", "royalty-free", "exclusive rights", "non-exclusive"],
    "Rights Retained": ["retain rights", "actor retains", "own work", "copyright"],
    "Content Removal": ["remove content", "withdraw recording", "delete files", "content removal"],
    "Platform Usage Rights": ["platform rights", "perpetual use", "revocable", "irrevocable", "usage rights"]
  };

  const bodyText = document.body.innerText.toLowerCase();
  const results = {};

  for (const [category, keywords] of Object.entries(categories)) {
    const found = [];
    keywords.forEach(keyword => {
      const match = bodyText.match(new RegExp(`.{0,150}${keyword}.{0,150}`, "gi"));
      if (match) found.push(...match);
    });
    if (found.length > 0) results[category] = found;
  }

  return results;
}

function displaySummary(results) {
  const container = document.getElementById("summaryContainer");
  container.innerHTML = "";

  if (!results || Object.keys(results).length === 0) {
    container.innerHTML = "<p>No relevant information found on this page.</p>";
    return;
  }

  for (const [category, snippets] of Object.entries(results)) {
    const card = document.createElement("div");
    card.className = "summary-card";

    const header = document.createElement("div");
    header.className = "card-header";
    header.textContent = category;
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      body.style.display = body.style.display === "block" ? "none" : "block";
    });

    const body = document.createElement("div");
    body.className = "card-body";
    body.style.display = "none";
    body.innerHTML = snippets.map(s => `<p>${s}</p>`).join("");

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  }
}

function displayLLMFeedback(feedback) {
  const container = document.getElementById("summaryContainer");

  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "llm-feedback";
  feedbackDiv.innerHTML = `<h3>LLM Summary Feedback:</h3><p>${feedback}</p>`;

  container.appendChild(feedbackDiv);
}

