document.addEventListener("input", function(event) {
    const text = event.target.value || "";
    chrome.storage.local.get(["userText"], function(result) {
      const updatedText = (result.userText || "") + " " + text;
      chrome.storage.local.set({ userText: updatedText });
    });
  });
  