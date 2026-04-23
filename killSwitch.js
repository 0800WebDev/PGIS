// Global script


const runSafely = (fn) => {
  try { fn(); } catch (e) { console.warn(e); }
};

function reexecuteScripts() {
  const scripts = document.querySelectorAll("script");

  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");

    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    oldScript.remove();
    document.body.appendChild(newScript);
  });
}

// META
runSafely(() => {
  const meta = document.createElement("meta");
  meta.setAttribute("charset", "UTF-8");
  document.head?.insertBefore(meta, document.head.firstChild);
});

// LIGHT / DARK MODE
window.addEventListener("load", () => runSafely(() => {
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Light Mode";

  Object.assign(toggleBtn.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: "999999",
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#444",
    color: "whitesmoke",
    border: "none",
    borderRadius: "5px"
  });

  document.body.appendChild(toggleBtn);

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    body.light-mode { background:white !important; color:black !important; }
    body.light-mode a { color:black !important; }
  `;
  document.head?.appendChild(styleTag);

  let lightMode = localStorage.getItem("lightMode") === "true";

  const applyLight = () => {
    document.body.classList.add("light-mode");
    toggleBtn.textContent = "Dark Mode";
    localStorage.setItem("lightMode", "true");
  };

  const applyDark = () => {
    document.body.classList.remove("light-mode");
    toggleBtn.textContent = "Light Mode";
    localStorage.setItem("lightMode", "false");
  };

  if (lightMode) applyLight();

  toggleBtn.onclick = () => {
    lightMode = !lightMode;
    lightMode ? applyLight() : applyDark();
  };
}));

// RELOAD BUTTON 
window.addEventListener("load", () => runSafely(() => {
  const btn = document.createElement("button");
  btn.textContent = "↺";

  Object.assign(btn.style, {
    position: "fixed",
    top: "45px",
    right: "10px",
    zIndex: "999999",
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#444",
    color: "whitesmoke",
    border: "none",
    borderRadius: "5px"
  });

  btn.onclick = async () => {
    try {
      const res = await fetch(location.href, { cache: "no-store" });
      const text = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const newHTML = doc.documentElement;

      // replace page
      document.documentElement.replaceWith(newHTML);

      // re-run scripts after DOM swap
      setTimeout(reexecuteScripts, 0);
    } catch (e) {
      console.warn("Soft reload failed:", e);
    }
  };

  document.body.appendChild(btn);
}));

// KILLSWITCH
runSafely(() => {
  fetch("/killswitch.json", { cache: "no-store" })
    .then(r => r.json().catch(() => null))
    .then(cfg => {
      if (!cfg || cfg.enabled) return;
      startShutdownTimer(cfg.timer || 1);
    })
    .catch(() => {});
});

function startShutdownTimer(minutes) {
  runSafely(() => {
    let remaining = minutes * 60;

    const banner = document.createElement("div");

    Object.assign(banner.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      background: "black",
      color: "white",
      zIndex: "999999",
      padding: "10px",
      textAlign: "center",
      fontFamily: "monospace"
    });

    document.body.appendChild(banner);

    const interval = setInterval(() => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;

      banner.innerHTML = `Closing in ${m}:${s}`;

      if (remaining-- <= 0) {
        clearInterval(interval);
        killPage();
      }
    }, 1000);
  });
}

function killPage() {
  runSafely(() => {
    window.stop();
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.innerHTML = "";
    location.replace("about:blank");
  });
}

// IFRAME HOTKEY
runSafely(() => {
  const iframe = document.querySelector("iframe");
  if (!iframe) return;

  iframe.addEventListener("load", () => {
    try {
      iframe.contentWindow?.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "q") {
          location.href = "https://www.google.com";
        }
      });
    } catch {}
  });
});

// FULLSCREEN BUTTON
window.addEventListener("load", () => runSafely(() => {
  const iframe = document.querySelector("iframe");
  if (!iframe) return;

  iframe.id = "gameIframe";

  const btn = document.createElement("button");
  btn.textContent = "Fullscreen";

  Object.assign(btn.style, {
    position: "fixed",
  top: "20px",
  left: "330px",
  zIndex: "999999",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#444",
  color: "whitesmoke",
  borderRadius: "5px"
  });

  btn.onclick = () => {
    const f = document.getElementById("gameIframe");
    if (!f) return;
    f.requestFullscreen?.();
  };

  document.body.appendChild(btn);
}));

// BATTERY
runSafely(() => {
  if (!navigator.getBattery) return;

  navigator.getBattery().then(battery => {
    let alerted = false;

    const check = () => {
      if (battery.level <= 0.1 && !alerted) {
        alert("Battery below 10%");
        alerted = true;
      }
      if (battery.level > 0.1) alerted = false;
    };

    battery.addEventListener("levelchange", check);
    check();
  });
});

// ABOUT:BLANK LAUNCH
(() => {
  const hasIframe = document.querySelector("iframe");
  if (!hasIframe) return;

  const btn = document.createElement("button");
  btn.textContent = "Open in about:blank";

  Object.assign(btn.style, {
    position: "fixed",
    top: "20px",
    left: "410px",
    zIndex: "999999",
    background: "#444",
    color: "whitesmoke",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  });

  document.body.appendChild(btn);

  btn.onclick = () => {
    const win = window.open("about:blank");
    if (!win) return;

    win.document.open();
    win.document.write(document.documentElement.outerHTML);
    win.document.close();
  };
})();



(function () {
  const originalTitle = document.title;

  const btn = document.createElement("button");
  btn.textContent = "Cloak tab";

  Object.assign(btn.style, {
    position: "fixed",
    top: "20px",
    left: "548px",
    zIndex: "99999",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#444",
    color: "whitesmoke",
    borderRadius: "5px"
  });

  document.body?.appendChild(btn);

  let toggled = false;

  function setFavicon(url) {
    let link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");

    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = url;

    document.head?.appendChild(link);
  }

  const originalFavicon =
    document.querySelector("link[rel~='icon']")?.href || "";

  btn.onclick = () => {
    toggled = !toggled;

    if (toggled) {
      document.title = "Google Classroom";
      setFavicon("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://staticin.pages.dev/settings&size=16");
    } else {
      document.title = originalTitle;
      setFavicon(originalFavicon);
    }
  };
})();
