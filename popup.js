import { getLLMFeedback } from "./llmHandler.js"; 

console.log("Popup loaded");

document.getElementById("scrapeBtn").addEventListener("click", async () => {
  console.log("Scrape button clicked");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractTerms
  }, async (results) => { 
    const data = results[0]?.result;
    console.log("Received extracted data:", data);
    displaySummary(data);

    const feedback = await getLLMFeedback(data);
    console.log("LLM Feedback:", feedback);
    displayLLMFeedback(feedback);
  });
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
      const match = bodyText.match(new RegExp(`.{0,80}${keyword}.{0,80}`, "gi"));
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
    const accordion = document.createElement("div");
    accordion.className = "accordion";

    const header = document.createElement("div");
    header.className = "accordion-header";
    header.textContent = category;
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      body.style.display = body.style.display === "block" ? "none" : "block";
    });

    const body = document.createElement("div");
    body.className = "accordion-body";
    body.innerHTML = snippets.map(s => `<p>${s}</p>`).join("");

    accordion.appendChild(header);
    accordion.appendChild(body);
    container.appendChild(accordion);
  }
}

function displayLLMFeedback(feedback) {
  const container = document.getElementById("summaryContainer");

  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "llm-feedback";
  feedbackDiv.innerHTML = `<h3>LLM Summary Feedback:</h3><p>${feedback}</p>`;

  container.appendChild(feedbackDiv);
}


//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