
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.local.set({ rm_warning: false });
}

let rmEnabled = true;

const style = document.createElement("style");
style.id = "rm-shorts-style";
document.head.appendChild(style);

function updateStyleSheet() {
  if (rmEnabled) {
    style.textContent = `
      yt-tab-shape[tab-title="Shorts"] { display: none !important; }
      .tabGroupShapeSlider { display: none !important; }
    `;
  } else {
    style.textContent = "";
  }
}

function rmShorts() {
  if (!rmEnabled) return;

  document
    .querySelectorAll<HTMLElement>("ytd-guide-entry-renderer")
    .forEach((el) => {
      const text = (el.innerText || "").toLowerCase();
      const aria = (el.getAttribute("aria-label") || "").toLowerCase();

      if (text.includes("shorts") || aria.includes("shorts")) {
        el.remove();
      }
    });

  document
    .querySelectorAll<HTMLElement>(
      "ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer"
    )
    .forEach((el) => el.remove());
}

function updateFromStorage() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["rm_shorts"], (result) => {
      rmEnabled =
        result.rm_shorts !== undefined ? !!result.rm_shorts : true;

      updateStyleSheet();

      if (rmEnabled) {
        rmShorts();
      }
    });
  }
}

updateFromStorage();

const observer = new MutationObserver(() => {
  rmShorts();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

rmShorts();

window.addEventListener("beforeunload", () => {
  observer.disconnect();
});