function applyFonts(enFont, faFont) {
  let style = document.getElementById("custom-split-font-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "custom-split-font-style";
    document.head.appendChild(style);
  }

  const getFontSrc = (fontInput) => {
    if (fontInput === "default") return null;
    if (fontInput.includes(".")) {
      const fontUrl = chrome.runtime.getURL(`fonts/${fontInput}`);
      return `url('${fontUrl}')`;
    }
    return `local('${fontInput}')`;
  };

  const enSrc = getFontSrc(enFont);
  const faSrc = getFontSrc(faFont);

  if (!enSrc && !faSrc) {
    style.textContent = "";
    return;
  }

  let css = "";

  if (faSrc) {
    css += `
      @font-face {
        font-family: 'SplitExtensionFont';
        src: ${faSrc};
        unicode-range: U+0600-06FF, U+FB50-FDFF, U+FE70-FEFF;
      }
    `;
  }

  if (enSrc) {
    css += `
      @font-face {
        font-family: 'SplitExtensionFont';
        src: ${enSrc};
        unicode-range: U+0000-00FF;
      }
    `;
  }

  const nativeFallbackStack =
    "'Google Sans', 'Google Sans Text', Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

  css += `
    *:not(.material-symbols-outlined):not(.google-symbols):not(mat-icon):not([class*="icon"]) {
      font-family: 'SplitExtensionFont', ${nativeFallbackStack} !important;
    }
  `;

  style.textContent = css;
}

chrome.storage.sync.get(["enFont", "faFont"], (data) => {
  applyFonts(data.enFont || "default", data.faFont || "default");
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    chrome.storage.sync.get(["enFont", "faFont"], (data) => {
      applyFonts(data.enFont || "default", data.faFont || "default");
    });
  }
});
