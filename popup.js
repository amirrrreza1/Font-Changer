document.addEventListener("DOMContentLoaded", () => {
  const enInput = document.getElementById("en-font");
  const faInput = document.getElementById("fa-font");
  const saveBtn = document.getElementById("save-btn");
  const resetBtn = document.getElementById("reset-btn");
  const statusDiv = document.getElementById("status");

  const defaultEnFont = "JetBrainsMono.ttf";
  const defaultFaFont = "Shabnam.ttf";

  chrome.storage.sync.get(["enFont", "faFont"], (data) => {
    enInput.value = data.enFont || defaultEnFont;
    faInput.value = data.faFont || defaultFaFont;
  });

  const showStatus = (message, bgColor = "#dcfce7", textColor = "#16a34a") => {
    statusDiv.textContent = message;
    statusDiv.style.background = bgColor;
    statusDiv.style.color = textColor;
    statusDiv.style.display = "block";
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 2000);
  };

  saveBtn.addEventListener("click", () => {
    const enFont = enInput.value;
    const faFont = faInput.value;

    chrome.storage.sync.set({ enFont, faFont }, () => {
      showStatus("Saved! Fonts updated.");
    });
  });

  resetBtn.addEventListener("click", () => {
    enInput.value = defaultEnFont;
    faInput.value = defaultFaFont;
    chrome.storage.sync.remove(["enFont", "faFont"], () => {
      showStatus("Reset to defaults!", "#f1f5f9", "#475569");
    });
  });
});
