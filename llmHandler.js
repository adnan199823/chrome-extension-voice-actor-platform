const API_URL = "http://localhost:3000/llm"; 

export async function getLLMFeedback(fetchedData) {
  try {
    const prompt = generatePromptFromData(fetchedData);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

    const result = await response.json();
    return result.response || "No feedback received.";
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return error.message;
  }
}

function generatePromptFromData(data) {
  let text = "Give a brief summary (max 60 words) and flag any serious concerns (like AI use, privacy issues, or unfair licensing terms) based on the following contract info:\n\n";
  for (const [category, snippets] of Object.entries(data)) {
    text += `Category: ${category}\nSnippets:\n${snippets.slice(0, 2).join("\n")}\n\n`;
  }
  return text;
}

export async function getLLMAnswerFromQuestion(data, question) {
  try {
    const prompt = generateQuestionPrompt(data, question);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

    const result = await response.json();
    return result.response || "No answer received.";
  } catch (error) {
    console.error("Error getting LLM answer:", error);
    return error.message;
  }
}

function generateQuestionPrompt(data, question) {
  let baseContext = "Based on the following contract snippets, answer the user's question clearly in max 30-40 words. Be direct, short and accurate.\n\n";
  for (const [category, snippets] of Object.entries(data)) {
    baseContext += `Category: ${category}\nSnippets:\n${snippets.slice(0, 2).join("\n")}\n\n`;
  }
  baseContext += `\nUser question: "${question}"\nAnswer in 30-40 words:`;
  return baseContext;
}
