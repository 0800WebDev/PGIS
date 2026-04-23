//basically a global script


const safe = (fn) => {
  try { fn(); } catch (e) { console.warn("Script error:", e); }
};

// Meta charset (safe head check)
safe(() => {
  const meta = document.createElement("meta");
  meta.setAttribute("charset", "UTF-8");

  if (document.head) {
    document.head.insertBefore(meta, document.head.firstChild);
  }
});

// LIGHT / DARK MODE + BUTTON
window.addEventListener("load", () => safe(() => {
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
    color: "white",
    border: "none",
    borderRadius: "5px"
  });

  document.body.appendChild(toggleBtn);

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    body.light-mode { background: white !important; color: black !important; }
    body.light-mode a { color: black !important; }
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

  toggleBtn.addEventListener("click", () => {
    lightMode = !lightMode;
    lightMode ? applyLight() : applyDark();
  });
}));

// RELOAD BUTTON (safe + no DOM replacement issues)
window.addEventListener("load", () => safe(() => {
  const btn = document.createElement("button");
  btn.textContent = "↺";

  Object.assign(btn.style, {
    position: "fixed",
    top: "40px",
    right: "10px",
    zIndex: "999999",
    padding: "8px 12px",
    cursor: "pointer",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "5px"
  });

  btn.onclick = () => location.reload();

  document.body.appendChild(btn);
}));

// KILLSWITCH (fully safe)
safe(() => {
  fetch("/killswitch.json", { cache: "no-store" })
    .then(r => r.json().catch(() => null))
    .then(cfg => {
      if (!cfg || cfg.enabled) return;
      startShutdownTimer(cfg.timer || 1);
    })
    .catch(() => {});
});

function startShutdownTimer(minutes) {
  safe(() => {
    let remaining = minutes * 60;

    const banner = document.createElement("div");
    Object.assign(banner.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      padding: "10px",
      background: "black",
      color: "white",
      zIndex: "999999",
      fontFamily: "monospace",
      textAlign: "center"
    });

    document.body?.appendChild(banner);

    const interval = setInterval(() => {
      if (!banner) return;

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
  safe(() => {
    window.stop();
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.innerHTML = "";
    location.replace("about:blank");
  });
}

// IFRAME HOTKEY (safe)
safe(() => {
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

// FULLSCREEN BUTTON (safe)
window.addEventListener("load", () => safe(() => {
  const iframe = document.querySelector("iframe");
  if (!iframe) return;

  iframe.id = "gameIframe";

  const btn = document.createElement("button");
  btn.textContent = "Fullscreen";

  Object.assign(btn.style, {
    position: "fixed",
    top: "20px",
    left: "330px",
    zIndex: "999999"
  });

  btn.onclick = () => {
    const f = document.getElementById("gameIframe");
    if (!f) return;
    f.requestFullscreen?.();
  };

  document.body.appendChild(btn);
}));

// BATTERY (safe API check)
safe(() => {
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
