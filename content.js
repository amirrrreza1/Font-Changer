function applyFonts(enFont, faFont) {
  let style = document.getElementById("custom-split-font-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "custom-split-font-style";
    document.head.appendChild(style);
  }

  const getFontSrc = (fontInput) => {
    if (fontInput.includes(".")) {
      const fontUrl = chrome.runtime.getURL(`fonts/${fontInput}`);
      return `url('${fontUrl}')`;
    }
    return `local('${fontInput}')`;
  };

  style.innerHTML = `
    /* Define the Persian subset */
    @font-face {
      font-family: 'SplitExtensionFont';
      src: ${getFontSrc(faFont)};
      unicode-range: U+0600-06FF, U+FB50-FDFF, U+FE70-FEFF;
    }
    
    /* Define the English subset */
    @font-face {
      font-family: 'SplitExtensionFont';
      src: ${getFontSrc(enFont)};
      unicode-range: U+0000-00FF;
    }

    /* Apply to everything EXCEPT Google's UI icons */
    *:not(.material-symbols-outlined):not(.google-symbols):not(mat-icon):not([class*="icon"]) {
      font-family: 'SplitExtensionFont', sans-serif !important;
    }
  `;
}

chrome.storage.sync.get(["enFont", "faFont"], (data) => {
  const enFont = data.enFont || "Arial";
  const faFont = data.faFont || "Tahoma";
  applyFonts(enFont, faFont);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    chrome.storage.sync.get(["enFont", "faFont"], (data) => {
      applyFonts(data.enFont || "Arial", data.faFont || "Tahoma");
    });
  }
});
