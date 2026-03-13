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
  btn.textContent = "Fullscreen."
  btn.style.position = "fixed"
  btn.style.top = "10px"
  btn.style.left = "10px"
  btn.style.zIndex = "9999"
  btn.style.border = "none"

  btn.addEventListener("click", () => {
    const f = document.getElementById("gameIframe")
    if (!f) return

    if (f.requestFullscreen) f.requestFullscreen()
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen()
    else if (f.msRequestFullscreen) f.msRequestFullscreen()
  })

  document.body.appendChild(btn)
})
