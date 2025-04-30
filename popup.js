import { getLLMFeedback, getLLMAnswerFromQuestion } from "./llmHandler.js"; 

console.log("Popup loaded");

let extractedContractData = null; 

document.getElementById("scrapeBtn").addEventListener("click", async () => {
  console.log("Scrape button clicked");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractTerms
  }, async (results) => { 
    extractedContractData = results[0]?.result;
    console.log("Received extracted data:", extractedContractData);

    displaySummary(extractedContractData);

    const feedback = await getLLMFeedback(extractedContractData);
    console.log("LLM Feedback:", feedback);
    displayLLMFeedback(feedback);
  });
});

document.getElementById("qaSubmit").addEventListener("click", async () => {
  const input = document.getElementById("qaInput");
  const responseDiv = document.getElementById("qaResponse");

  const question = input.value.trim();
  if (!question || !extractedContractData) return;

  responseDiv.innerHTML = "⏳ Thinking...";
  const answer = await getLLMAnswerFromQuestion(extractedContractData, question);
  input.value = ""; 
  responseDiv.innerHTML = `<p><strong>Answer:</strong> ${answer}</p>`;
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
      const match = bodyText.match(new RegExp(`.{0,250}${keyword}.{0,250}`, "gi"));
      if (match) found.push(...match);
    });
    if (found.length > 0) results[category] = found;
  }

  return results;
}

function displayLLMFeedback(feedback) {
  const container = document.getElementById("summaryContainer");

  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "llm-feedback-enhanced";
  feedbackDiv.innerHTML = `
    <div class="llm-header">
      <img src="icon.png" alt="AI Icon" class="llm-icon" />
      <h3>AI Summary</h3>
    </div>
    <p>${feedback}</p>
  `;

  container.appendChild(feedbackDiv);
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
    header.innerHTML = `<span>${category}</span><span class="toggle-icon">+</span>`;
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      const icon = header.querySelector(".toggle-icon");
      const isVisible = body.style.display === "block";
      body.style.display = isVisible ? "none" : "block";
      icon.textContent = isVisible ? "+" : "−";
    });

    const body = document.createElement("div");
    body.className = "accordion-body";
    body.innerHTML = snippets.map(s => `<div class="snippet-phrase">• ${s}</div>`).join("");

    accordion.appendChild(header);
    accordion.appendChild(body);
    container.appendChild(accordion);
  }
}



//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