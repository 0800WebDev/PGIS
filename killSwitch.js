//this is basicly just a global script





// Create a meta element
  const meta = document.createElement('meta');
  meta.setAttribute('charset', 'UTF-8');

  // Insert it at the beginning of the head
  const head = document.head;
  head.insertBefore(meta, head.firstChild);






window.addEventListener("load", () => {
  // CREATE LIGHT/DARK TOGGLE BUTTON
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = "Light Mode";
  toggleBtn.id = "lightDarkToggle";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "10px";
  toggleBtn.style.right = "10px";
  toggleBtn.style.zIndex = "9999";
  toggleBtn.style.padding = "8px 12px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.backgroundColor = "#444";
  toggleBtn.style.color = "whitesmoke";
  toggleBtn.style.border = "none";
  toggleBtn.style.borderRadius = "5px";
  document.body.appendChild(toggleBtn);

  // CREATE STYLE TAG FOR LIGHT MODE
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    body.light-mode {
      background-color: white !important;
      color: black !important;
    }
    body.light-mode a {
      color: black !important;
    }
    body.light-mode button {
      background-color: black !important;
      color: white !important;
    }
    body.light-mode button:hover {
      background-color: white !important;
      color: black !important;
    }
  `;
  document.head.appendChild(styleTag);

  // FUNCTION TO APPLY LIGHT MODE
  function applyLightMode() {
    document.body.classList.add("light-mode");
    toggleBtn.textContent = "Dark Mode";
    localStorage.setItem("lightMode", "true");
  }

  // FUNCTION TO APPLY DARK MODE (REMOVE LIGHT MODE CLASS)
  function applyDarkMode() {
    document.body.classList.remove("light-mode");
    toggleBtn.textContent = "Light Mode";
    localStorage.setItem("lightMode", "false");
  }

  // LOAD PREFERENCE
  let lightMode = localStorage.getItem("lightMode") === "true";
  if (lightMode) applyLightMode();

  // TOGGLE CLICK
  toggleBtn.addEventListener("click", () => {
    lightMode = !lightMode;
    if (lightMode) applyLightMode();
    else applyDarkMode();
  });
});





// reload button
window.addEventListener("load", () => {
    const btn = document.createElement("button")
  btn.textContent = "↺"
  btn.style.position = "fixed"
  btn.style.top = "40px"
  btn.style.left = "10px"
  btn.style.zIndex = "9999"
  btn.style.padding = "8px 12px"
  btn.style.cursor = "pointer"

  btn.onclick = async () => {
    const res = await fetch(location.href)
    const text = await res.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(text, "text/html")

    document.documentElement.innerHTML = doc.documentElement.innerHTML

    const scripts = document.querySelectorAll("script")
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script")

      if (oldScript.src) {
        newScript.src = oldScript.src
      } else {
        newScript.textContent = oldScript.textContent
      }

      document.body.appendChild(newScript)
      oldScript.remove()
    })
  }

  document.body.appendChild(btn)
})






fetch("/killswitch.json", { cache: "no-store" })
  .then(r => r.json())
  .then(cfg => {
    if (!cfg.enabled) {
      startShutdownTimer(cfg.timer);
    }
  });

function startShutdownTimer(minutes) {
  let remaining = minutes * 60; // seconds

  // Create warning banner
  const banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "12px";
  banner.style.background = "black";
  banner.style.color = "white";
  banner.style.fontFamily = "monospace";
  banner.style.textAlign = "center";
  banner.style.zIndex = "999999";
  document.body.appendChild(banner);

  const interval = setInterval(() => {
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;

    banner.innerHTML =
      `This page is closing temporarily in ${min} minutes and ${sec} seconds please click <a href="/info.txt">here</a> for more info`;

    if (remaining <= 0) {
      clearInterval(interval);
      killPage();
    }

    remaining--;
  }, 1000);
}

function killPage() {
  // Stop loading/execution
  window.stop();

  // Clear storage
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  // Blank the page
  document.documentElement.innerHTML = "";

  // Redirect to blank
  location.replace("about:blank");

  // Attempt close (will only work if JS-opened)
  setTimeout(() => {
    window.close();
  }, 100);
}





const iframe = document.querySelector("iframe");

iframe.addEventListener("load", () => {
    iframe.contentWindow.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === "q") {
            window.location.href = "https://www.google.com";
        }
    });
});



const s=document.createElement("script")
s.async=true
s.src="https://plausible.io/js/pa-7RQ-wKkPtManKgQ5IRQrg.js"
document.head.appendChild(s)

window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)}
plausible.init=plausible.init||function(i){plausible.o=i||{}}
plausible.init()

document.addEventListener("DOMContentLoaded", function () {
  var hasIframe = document.querySelector("iframe") !== null;

  plausible("pageview", {
    props: {
      has_iframe: hasIframe ? "yes" : "no"
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  plausible("pageview", {
    props: {
      site_domain: location.hostname
    }
  });
});








window.addEventListener("load", () => {
  const iframe = document.querySelector("iframe")
  if (!iframe) return

  // Give the iframe an id
  iframe.id = "gameIframe"

  // Create fullscreen button
  const btn = document.createElement("button")
  btn.textContent = "Fullscreen"
  btn.style.position = "fixed"
  btn.style.top = "20px"
  btn.style.left = "330px"
  btn.style.zIndex = "9999"
  btn.style.border = "none"
  btn.style.cursor = "pointer"
  btn.style.backgroundColor = "#444"
  btn.style.color = "whitesmoke"
  btn.style.borderRadius = "5px"



  btn.addEventListener("click", () => {
    const f = document.getElementById("gameIframe")
    if (!f) return

    if (f.requestFullscreen) f.requestFullscreen()
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen()
    else if (f.msRequestFullscreen) f.msRequestFullscreen()
  })

  document.body.appendChild(btn)
})







navigator.getBattery().then(battery => {
  let alerted = false;

  function checkBattery() {
    if (battery.level <= 0.1 && !alerted) {
      alert("Battery is below 10%");
      alerted = true;
    }

    if (battery.level > 0.1) {
      alerted = false;
    }
  }

  battery.addEventListener("levelchange", checkBattery);
  checkBattery();
});


(() => {
  const hasIframe = document.querySelectorAll("iframe").length > 0;
  if (!hasIframe) return;

  const btn = document.createElement("button");
  btn.textContent = "Open in about:blank";
btn.style.position = "fixed"
  btn.style.top = "20px"
  btn.style.left = "410px"
  btn.style.zIndex = "9999"
  btn.style.border = "none"
  btn.style.cursor = "pointer"
  btn.style.backgroundColor = "#444"
  btn.style.color = "whitesmoke"
  btn.style.borderRadius = "5px"
  document.body.appendChild(btn);

  const origin = location.origin;

  function absolutize(html) {
    return html
      .replace(/(src|href)=["']\/(?!\/)/g, (m, attr) => `${attr}="${origin}/`)
      .replace(/url\(["']?\/(?!\/)/g, (m) => `url("${origin}/`);
  }

  btn.onclick = () => {
    const win = window.open("about:blank");
    if (!win) return;

    const html = document.documentElement.outerHTML;
    const fixed = absolutize(html);

    win.document.open();
    win.document.write(fixed);
    win.document.close();
  };
})();



(function () {
  const originalTitle = document.title;

  const faviconEl =
    document.querySelector("link[rel~='icon']") ||
    document.createElement("link");

  const originalFavicon = faviconEl.href || "";

  let toggled = false;

  const btn = document.createElement("button");
  btn.textContent = "Cloak tab";
  btn.style.position = "fixed"
  btn.style.top = "20px"
  btn.style.left = "440px"
  btn.style.zIndex = "999"
  btn.style.border = "none"
  btn.style.cursor = "pointer"
  btn.style.backgroundColor = "#444"
  btn.style.color = "whitesmoke"
  btn.style.borderRadius = "5px"

  document.body.appendChild(btn);

  btn.onclick = () => {
    toggled = !toggled;

    if (toggled) {
      document.title = "Google Classroom";
      setFavicon("https://www.google.com/favicon.ico");
    } else {
      document.title = originalTitle;
      setFavicon(originalFavicon);
    }
  };

  function setFavicon(url) {
    let link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");

    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = url;

    document.head.appendChild(link);
  }
})();

