(function () {
  var theme;
  try {
    theme = localStorage.getItem("theme");
  } catch {}
  document.documentElement.dataset.theme =
    theme === "light" || theme === "dark" ? theme : "light";
})();
