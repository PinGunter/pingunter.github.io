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
    } else {
      document.body.className = "light";
      document.getElementById("toggle").classList = "toggle dark";
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
  debugger;
  items.style.display = state ? "block" : "none";
  locToggle.innerText = `${state ? "▼" : "▶"} List of Contents`;
});

const galleryToggle = document.getElementById("gallery");
locToggle.addEventListener("click", () => {
  const items = document.getElementById("loc-items");
  const state = items.style.display === "none" || !items.style.display;
  debugger;
  items.style.display = state ? "block" : "none";
  locToggle.innerText = `${state ? "▼" : "▶"} List of Contents`;
});
