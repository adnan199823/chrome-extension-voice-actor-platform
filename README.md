# 
# 🎙️ Voice Terms Collector - A Chrome Extension for Summarizing Voice Actors Privacy Data

This Chrome extension helps **voice actors** gain a transparent and overall idea on how their **data, voice recordings, and labor are used and compensated** on major casting platforms by automatically detecting project creation pages, extracting contract-related textual information, and summarizing them using an AI language model.

---

## 🚀 Features Implemented

### ✅ 1. Auto-Detection of Project Creation
- Detects when a user **starts a project** on any of the following platforms:
  - Voices.com
  - Voice123.com
  - Bodalgo
  - VOPlanet
  - CastVoices
  - UpWork
  - Fiverr
  - CastingCall.club
  - Backstage.com
  - Freelancer.com
  - ACX
  - Voquent
  - Bunny Studio (VoiceBunny)
- When a voice actor's new project creation page is detected (e.g., URL contains `create`, `new`, `post`, etc.), it **automatically scrapes that page's content** for contract-related terms and **saves the structured data to `Chrome's Local Storage`**.

---

### ✅ 2. Manual Scrape and Summarization via Popup
- The extension popup provides a **"📄 Collect & Summarize"** button for manually scraping the current tab.
- It extracts contract terms under these categories:
  - Voice & Data Ownership
  - AI Use of Recordings
  - Compensation
  - Payment Timeline & Dispute Resolution
  - Buy-Outs and Licensing
  - Rights Retained
  - Content Removal
  - Platform Usage Rights
- Displays contract terms in an expandable **accordion-style summary**.

---

### ✅ 3. AI-Powered Contract Summary
- Uses a connected local server (`http://localhost:3000/llm`) to:
  - Generate a brief, high-level summary of contract risks and highlights.
  - Flag any serious concerns (e.g., AI misuse, copyright violations, etc.).
- Summary is shown with a custom **AI summary card** inside the popup.

---

### ✅ 4. Interactive Q&A Interface
- Users can ask questions to our AI model like:
  > “Can this platform reuse my voice for AI?”
- The extension uses the LLM backend to **generate a direct answer in 30–40 words** using extracted contract content as context.

---

## 🛠️ How to Run the Project

Follow these steps to set up and run the extension locally:

1. **Clone the repository**

2. **Navigate to the `Backend` folder.**

3. **Start the backend server. Install the required dependencies (express, cors, axios). The command to run the server:**

```node backendLLM.js```

4. **open chrome extension page in the browser (`chrome://extensions/`).**

5. **Enable 'Developer mode' (toggle at top-right).**

6. **load the extension by clicking 'Load unpacked' button (load the entire cloned folder).**

7. **Test the extension by running it on different voice actor platform websites.**
