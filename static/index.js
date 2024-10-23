function onLoad() {
  const theme = localStorage.getItem("darkTheme");
  if (!theme) {
    localStorage.setItem("darkTheme", "false");
  } else {
    updateCSS();
  }
}

function updateCSS() {
  const theme = localStorage.getItem("darkTheme");
  if (theme) {
    if (theme === "true") {
      document.body.className = "dark";
      document.getElementById("toggle").classList = "toggle light";
      document.getElementById("diagram_dark").style.display = "inherit";
      document.getElementById("diagram_light").style.display = "none";
    } else {
      document.body.className = "light";
      document.getElementById("toggle").classList = "toggle dark";
      document.getElementById("diagram_dark").style.display = "none";
      document.getElementById("diagram_light").style.display = "inherit";
    }
  }
}

function toggleDarkMode() {
  const isCurrentlyDark = localStorage.getItem("darkTheme") === "true";
  localStorage.setItem("darkTheme", !isCurrentlyDark);
  updateCSS();
}

const locToggle = document.getElementById("loc");
locToggle.addEventListener("click", () => {
  const items = document.getElementById("loc-items");
  const state = items.style.display === "none" || !items.style.display;
  items.style.display = state ? "block" : "none";
  locToggle.innerText = `${state ? "▼" : "▶"} List of Contents`;
});
