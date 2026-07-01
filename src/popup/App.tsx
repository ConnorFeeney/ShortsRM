import { useState, useEffect } from "react";
import { useChromeStorage } from "../hooks/useChromeStorage";

export default function App() {
  const [enabled, setEnabled] = useChromeStorage<boolean>("rm_shorts", false);
  const [showWarning, setShowWarning] =
    useChromeStorage<boolean>("rm_warning", false);
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "";
        setIsYouTube(url.includes("youtube.com"));
      });
    }
  }, []);

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    setShowWarning(true);
  }

  return (
    <div className="w-105 bg-zinc-950 text-white p-5 shadow-2xl border border-zinc-800">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-red-600/10 border border-red-500/30 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7-11-7z" />
          </svg>
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            ShortsRM
          </h1>
          <p className="text-xs text-zinc-400">
            Remove YouTube Shorts from your feed
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">

        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4">

          <div className="flex flex-col">
            <span className="text-sm font-medium">Remove Shorts</span>
            <span className="text-xs text-zinc-400">
              Filter Shorts automatically
            </span>
          </div>

          <button
            onClick={handleToggle}
            className={`relative w-16 h-9 flex items-center rounded-full transition-colors duration-300 ${
              enabled ? "bg-red-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                enabled ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {showWarning && isYouTube && (
          <div className="flex items-center gap-2 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-2.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Refresh YouTube for changes to take effect</span>
          </div>
        )}

      </div>

      <div className="mt-4 text-[11px] text-zinc-500 text-center">
        Active only on YouTube pages
      </div>
    </div>
  );
}