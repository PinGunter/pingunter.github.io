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
