const API_URL = "http://localhost:3000/llm"; 

export async function getLLMFeedback(fetchedData) {
    try {
      const prompt = generatePromptFromData(fetchedData);
  
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result.response || "No feedback received.";  
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return error.message;  
    }
  }


function generatePromptFromData(data) {
  let text = "Summarize and provide warnings or key notes based on the following extracted contract information for a voice actor:\n\n";
  for (const [category, snippets] of Object.entries(data)) {
    text += `Category: ${category}\nSnippets:\n${snippets.join("\n")}\n\n`;
  }
  text += "Highlight if there are any privacy concerns, AI reuse issues, or unfavorable clauses.";
  return text;
}
