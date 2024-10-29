chrome.runtime.onInstalled.addListener(() => {
    // Schedule a task for midnight daily
    chrome.alarms.create("dailyScore", { when: Date.now(), periodInMinutes: 1440 });
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "dailyScore") {
      chrome.storage.local.get("userText", async function(result) {
        const dailyText = result.userText || "";
  
        // Replace `sendToMLModel` with your API call function
        const score = await sendToMLModel(dailyText);
        
        // Store the score for dashboard use
        chrome.storage.local.set({ dailyScore: score, userText: "" });
      });
    }
  });
  