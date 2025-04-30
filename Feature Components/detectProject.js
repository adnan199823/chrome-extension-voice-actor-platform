(function detectProjectCreationAndExtractTerms() {
    const platforms = {
      "voices.com": "Voices.com",
      "voice123.com": "Voice123",
      "bodalgo.com": "Bodalgo",
      "voplanet.com": "VOPlanet",
      "castvoices.com": "CastVoices",
      "upwork.com": "UpWork",
      "fiverr.com": "Fiverr",
      "castingcall.club": "CastingCall.club",
      "backstage.com": "Backstage.com",
      "freelancer.com": "Freelancer.com",
      "acx.com": "ACX",
      "voquent.com": "Voquent",
      "bunnystudio.com": "BunnyStudio"
    };
  
    const currentURL = window.location.href;
    const matchedPlatformDomain = Object.keys(platforms).find(domain => currentURL.includes(domain));
  
    if (!matchedPlatformDomain) return;
  
    const platformName = platforms[matchedPlatformDomain];
  
    const likelyProjectKeywords = ["create", "post", "new", "job", "project", "gig", "offer"];
    const isCreatingProject = likelyProjectKeywords.some(k => currentURL.toLowerCase().includes(k));
  
    if (!isCreatingProject) return;
  
    console.log(`[VoiceGuard] Detected project creation on ${platformName}`);
  
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
  
    const storageKey = `terms_${platformName.toLowerCase().replace(/\s+/g, "")}`;
  
    chrome.storage.local.set({ [storageKey]: results }, () => {
      console.log(`[VoiceGuard] Saved contract terms for ${platformName} to local storage.`);
    });
  })();
  