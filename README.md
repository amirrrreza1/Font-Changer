# Font Splitter Extension Guide

This guide explains how to install your custom font-splitting extension across different browsers, how to add your own custom font files to it, how to make the extension permanent in Firefox, and how to apply it to other websites.

## 1\. How to Install the Extension (Standard)

### Google Chrome

1.  Open Chrome and navigate to chrome://extensions/ in your address bar.
2.  In the top right corner, turn on the **Developer mode** toggle.
3.  Click the **Load unpacked** button that appears in the top left.
4.  Select the folder containing your extension files (e.g., Font-Changer).
5.  The extension is now installed. Pin it to your toolbar for easy access!

### Microsoft Edge

Because Edge is built on the same engine as Chrome, the process is nearly identical:

1.  Open Edge and navigate to edge://extensions/ in your address bar.
2.  Turn on the **Developer mode** toggle switch in the bottom-left menu.
3.  Click the **Load unpacked** button at the top right of the main area.
4.  Select the folder containing your extension files.

### Mozilla Firefox (Temporary Install)

_Note: Temporary add-ons in Firefox are removed automatically when you restart the browser. See Section 3 for the permanent method._

1.  Open Firefox and navigate to about:debugging in your address bar.
2.  Click on **This Firefox** in the left-hand menu.
3.  Click the **Load Temporary Add-on...** button.
4.  Open your extension folder and select **any file** inside it (for example, manifest.json).

## 2\. How to Add Custom Fonts

You can add your own custom font files (like .ttf, .woff, or .woff2) directly into the extension so they are applied to Gemini and NotebookLM and other websites even if they aren't installed on your system.

### Step 1: Add Your Font Files

Copy your custom font files into fonts folder.

### Step 2: Reload the Extension

Whenever you add or remove files inside your extension folder, you must tell the browser to reload it.

1.  Go back to your browser's extension page (chrome://extensions/ or edge://extensions/).
2.  Find your "Font Splitter" extension.
3.  Click the **Reload icon** (a circular arrow).

### Step 3: Apply the Fonts

1.  Click on the extension icon in your browser toolbar to open the popup menu.
2.  Use the dropdown menus to select your custom font files.
3.  Click **Save & Apply**.
4.  Refresh your Gemini or NotebookLM or other websites to see the new fonts in action!

## 3\. How to Install Permanently on Firefox

Because of strict security policies, standard Firefox requires all permanent extensions to be digitally signed by Mozilla. You can do this easily for free by submitting it as a private, unlisted add-on.

### Step 1: Zip Your Extension Files

You must zip the _contents_ of your folder, not the outer folder itself.

1.  Open your Font-Changer folder.
2.  Select all the files inside (manifest.json, content.js, popup.html, the fonts folder, etc.).
3.  Right-click and choose **Compress** or **Send to > Compressed (zipped) folder**.
4.  Name the resulting file something like font-splitter.zip.

### Step 2: Submit to Firefox Developer Hub

1.  Go to the [Mozilla Add-ons Developer Hub](https://www.google.com/search?q=https://addons.mozilla.org/en-US/developers/&authuser=2).
2.  Log in or create a free Firefox account.
3.  Click **Submit a New Add-on**.
4.  When asked how you want to distribute your add-on, choose **On my own** (this keeps it private).
5.  Click **Continue**, upload your font-splitter.zip file, and wait a moment for the automated system to scan and approve it.

### Step 3: Download and Install

1.  Once approved, the dashboard will provide a link to download your signed add-on. It will be a file ending in **.xpi**.
2.  Download that .xpi file to your computer.
3.  Open your standard Firefox browser.
4.  Drag and drop the .xpi file directly into your Firefox browser window.
5.  A prompt will appear asking if you want to add the extension. Click **Add**.

Your custom font extension is now permanently installed in Firefox and will survive browser restarts!

## 4\. How to Apply to Other Websites

You can easily make this extension work on any other website (like ChatGPT, Claude, or any specific blog) by updating just one file: manifest.json.

### Step 1: Open manifest.json

Open your manifest.json file in any text editor. Look for the "matches" lists under "content_scripts" and "web_accessible_resources".

### Step 2: Add the New Websites

Add the URLs of the new websites to both lists. Make sure to use the wildcard format \*://\*.website.com/\* so it applies to all pages on that site. Don't forget the commas between each line!

### Step 3: Reload the Extension

Because you changed the manifest.json file, the browser needs to read it again:

1.  Go to your browser's extension page (chrome://extensions/ or edge://extensions/ or about:debugging in Firefox).
2.  Find your extension and click the **Reload** icon (the circular arrow).
3.  Go to the new website you added and refresh the page. Your custom fonts will now be applied there as well!

## 5. Toggle RTL Direction

The extension now includes a convenient floating button on supported pages (like ChatGPT, Claude, and Gemini) that allows you to instantly switch the chat layout to Right-To-Left (RTL) for a better reading experience with Arabic and Persian texts.

- **Floating Button:** Look for the square button with a swap icon (`⇄`) on the right side of the screen.
- **Hover to Expand:** Hovering over the button expands it, displaying "Toggle RTL" (or "Toggle LTR").
- **Click to Toggle:** Click the button to switch the entire page and chat layout direction. Click it again to revert to the default Left-To-Right (LTR) layout.
