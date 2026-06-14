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

function injectDirectionToggle() {
  if (document.getElementById("font-splitter-dir-toggle")) return;

  const container = document.createElement("div");
  container.id = "font-splitter-dir-toggle";
  
  const style = document.createElement("style");
  style.textContent = `
    #font-splitter-dir-toggle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      background: rgba(59, 130, 246, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-right: none;
      color: #fff;
      border-radius: 12px 0 0 12px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      cursor: pointer;
      box-shadow: -4px 0 15px rgba(0,0,0,0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2147483647;
      font-family: system-ui, -apple-system, sans-serif;
      user-select: none;
      direction: ltr !important;
    }
    #font-splitter-dir-toggle:hover {
      width: 150px;
      background: rgba(37, 99, 235, 1);
      box-shadow: -6px 0 20px rgba(0,0,0,0.3);
    }
    #font-splitter-dir-toggle-icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #font-splitter-dir-toggle-icon img {
      width: 24px;
      height: 24px;
    }
    #font-splitter-dir-toggle-text {
      position: absolute;
      right: 48px;
      top: 0;
      height: 48px;
      line-height: 48px;
      white-space: nowrap;
      padding-right: 12px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.2s ease;
      transition-delay: 0.1s;
    }
    #font-splitter-dir-toggle:hover #font-splitter-dir-toggle-text {
      opacity: 1;
    }
    @keyframes font-splitter-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(180deg); }
    }
    .font-splitter-animate-icon {
      animation: font-splitter-spin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .font-splitter-fade-text {
      opacity: 0 !important;
      transition-delay: 0s !important;
    }
    
    /* Global classes applied when toggled */
    body.font-splitter-is-rtl .prose,
    body.font-splitter-is-rtl .font-claude-message,
    body.font-splitter-is-rtl message-content,
    body.font-splitter-is-rtl .message-content,
    body.font-splitter-is-rtl [data-message-author-role] {
      direction: rtl !important;
      text-align: right !important;
    }
    body.font-splitter-is-rtl p {
      direction: rtl !important;
      text-align: right !important;
    }
  `;
  document.head.appendChild(style);

  const icon = document.createElement("div");
  icon.id = "font-splitter-dir-toggle-icon";
  const iconImg = document.createElement("img");
  iconImg.src = chrome.runtime.getURL("Images/change.svg");
  icon.appendChild(iconImg);

  const text = document.createElement("div");
  text.id = "font-splitter-dir-toggle-text";
  text.innerText = "Toggle RTL";

  container.appendChild(icon);
  container.appendChild(text);

  let isRtl = false;

  container.addEventListener("click", () => {
    isRtl = !isRtl;
    
    iconImg.classList.remove("font-splitter-animate-icon");
    void iconImg.offsetWidth;
    iconImg.classList.add("font-splitter-animate-icon");

    text.classList.add("font-splitter-fade-text");
    
    setTimeout(() => {
      if (isRtl) {
        document.documentElement.dir = "rtl";
        document.body.classList.add("font-splitter-is-rtl");
        text.innerText = "Toggle LTR";
      } else {
        document.documentElement.removeAttribute("dir");
        document.body.classList.remove("font-splitter-is-rtl");
        text.innerText = "Toggle RTL";
      }
      text.classList.remove("font-splitter-fade-text");
    }, 200);
  });

  document.body.appendChild(container);
}

if (document.body) {
  injectDirectionToggle();
} else {
  document.addEventListener('DOMContentLoaded', injectDirectionToggle);
}
