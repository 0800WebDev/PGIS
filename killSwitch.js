//this is basicly just a global script

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







window.addEventListener("load", () => {
  // Create light/dark toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = "Toggle Light Mode";
  toggleBtn.id = "lightDarkToggle";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "10px";
  toggleBtn.style.right = "10px";
  toggleBtn.style.zIndex = "9999";
  toggleBtn.style.padding = "8px 12px";
  toggleBtn.style.cursor = "pointer";
  document.body.appendChild(toggleBtn);

  // Store original styles for buttons
  const buttonOriginals = [];
  document.querySelectorAll("button").forEach(btn => {
    buttonOriginals.push({
      element: btn,
      background: getComputedStyle(btn).backgroundColor,
      color: getComputedStyle(btn).color
    });
  });

  // Apply light mode
  function applyLightMode() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.querySelectorAll("a").forEach(a => a.style.color = "black");
    document.querySelectorAll("button").forEach((btn) => {
      btn.style.backgroundColor = "black";
      btn.style.color = "white";
      btn.onmouseover = () => {
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
      };
      btn.onmouseout = () => {
        btn.style.backgroundColor = "black";
        btn.style.color = "white";
      };
    });
    toggleBtn.textContent = "Toggle Dark Mode";
    localStorage.setItem("lightMode", "true");
  }

  // Revert to dark mode
  function applyDarkMode() {
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.querySelectorAll("a").forEach(a => a.style.color = "");
    document.querySelectorAll("button").forEach((btn, i) => {
      const orig = buttonOriginals[i];
      btn.style.backgroundColor = orig.background;
      btn.style.color = orig.color;
      btn.onmouseover = null;
      btn.onmouseout = null;
    });
    toggleBtn.textContent = "Toggle Light Mode";
    localStorage.setItem("lightMode", "false");
  }

  // Check localStorage on load
  let lightMode = localStorage.getItem("lightMode") === "true";
  if (lightMode) applyLightMode();

  // Toggle button click
  toggleBtn.addEventListener("click", () => {
    lightMode = !lightMode;
    if (lightMode) applyLightMode();
    else applyDarkMode();
  });
});
