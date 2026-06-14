document.addEventListener("DOMContentLoaded", () => {
  const enInput = document.getElementById("en-font");
  const faInput = document.getElementById("fa-font");
  const showToggleInput = document.getElementById("show-toggle");
  const saveBtn = document.getElementById("save-btn");
  const resetBtn = document.getElementById("reset-btn");
  const statusDiv = document.getElementById("status");

  const defaultEnFont = "default";
  const defaultFaFont = "Shabnam.ttf";

  chrome.storage.sync.get(["enFont", "faFont", "showToggle"], (data) => {
    enInput.value = data.enFont || defaultEnFont;
    faInput.value = data.faFont || defaultFaFont;
    showToggleInput.checked = data.showToggle !== undefined ? data.showToggle : true;
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

  const toggleManageBtn = document.getElementById("toggle-manage-btn");
  const manageSitesSection = document.getElementById("manage-sites-section");
  const currentHostnameDiv = document.getElementById("current-hostname");
  const addCurrentBtn = document.getElementById("add-current-btn");
  const domainListDiv = document.getElementById("domain-list");
  
  const unconfiguredAlert = document.getElementById("unconfigured-alert");
  const quickAddBtn = document.getElementById("quick-add-btn");

  let currentHostname = "";
  let customDomains = [];

  toggleManageBtn.addEventListener("click", () => {
    if (manageSitesSection.style.display === "none") {
      manageSitesSection.style.display = "block";
      toggleManageBtn.innerText = "Manage Websites ▴";
    } else {
      manageSitesSection.style.display = "none";
      toggleManageBtn.innerText = "Manage Websites ▾";
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith("chrome://")) {
      try {
        currentHostname = new URL(tabs[0].url).hostname;
        currentHostnameDiv.textContent = currentHostname;
      } catch (e) {
        currentHostnameDiv.textContent = "Invalid URL";
        addCurrentBtn.disabled = true;
      }
    } else {
        currentHostnameDiv.textContent = "Cannot access page";
        addCurrentBtn.disabled = true;
    }

    chrome.storage.sync.get(["customDomains"], (data) => {
      customDomains = data.customDomains || [];
      renderDomainList();
    });
  });

  function renderDomainList() {
    domainListDiv.innerHTML = "";
    if (customDomains.length === 0) {
      domainListDiv.innerHTML = "<div style='text-align:center; padding:8px; color:rgba(255,255,255,0.4);'>No websites enabled</div>";
    } else {
      customDomains.forEach(domain => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; background: rgba(255,255,255,0.05); border-radius: 4px;";
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = domain;
        nameSpan.style.cssText = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
        
        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.style.cssText = "background: none; border: none; cursor: pointer; padding: 0; margin-left: 8px; color: #f87171; flex-shrink: 0; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;";
        delBtn.onclick = () => {
          customDomains = customDomains.filter(d => d !== domain);
          saveAndReload("Website removed!", domain);
        };
        
        row.appendChild(nameSpan);
        row.appendChild(delBtn);
        domainListDiv.appendChild(row);
      });
    }

    if (customDomains.includes(currentHostname)) {
      addCurrentBtn.textContent = "Added ✓";
      addCurrentBtn.style.background = "rgba(52, 211, 153, 0.2)";
      addCurrentBtn.style.color = "#34d399";
      addCurrentBtn.disabled = true;
      unconfiguredAlert.style.display = "none";
    } else {
      addCurrentBtn.textContent = "Add Site";
      addCurrentBtn.style.background = "var(--primary)";
      addCurrentBtn.style.color = "white";
      addCurrentBtn.disabled = !currentHostname;
      if (currentHostname) {
          unconfiguredAlert.style.display = "block";
      } else {
          unconfiguredAlert.style.display = "none";
      }
    }
  }

  function saveAndReload(msg, modifiedDomain) {
    chrome.storage.sync.set({ customDomains }, () => {
      renderDomainList();
      showStatus(msg);
      if (modifiedDomain === currentHostname) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if(tabs[0] && tabs[0].id) chrome.tabs.reload(tabs[0].id);
        });
      }
    });
  }

  const handleAddSite = () => {
    if (currentHostname && !customDomains.includes(currentHostname)) {
      customDomains.push(currentHostname);
      saveAndReload("Website added!", currentHostname);
    }
  };

  addCurrentBtn.addEventListener("click", handleAddSite);
  quickAddBtn.addEventListener("click", handleAddSite);

  showToggleInput.addEventListener("change", () => {
    chrome.storage.sync.set({ showToggle: showToggleInput.checked });
  });

  saveBtn.addEventListener("click", () => {
    const enFont = enInput.value;
    const faFont = faInput.value;
    const showToggle = showToggleInput.checked;

    chrome.storage.sync.set({ enFont, faFont, showToggle }, () => {
      showStatus("Saved!", "#dcfce7", "#16a34a");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0] && tabs[0].id) chrome.tabs.reload(tabs[0].id);
      });
    });
  });

  resetBtn.addEventListener("click", () => {
    enInput.value = defaultEnFont;
    faInput.value = defaultFaFont;
    showToggleInput.checked = true;
    chrome.storage.sync.remove(["enFont", "faFont", "showToggle"], () => {
      showStatus("Reset to defaults!", "#f1f5f9", "#475569");
    });
  });
});
