(function () {
  var theme;
  try {
    theme = localStorage.getItem("theme");
  } catch (_) {}
  document.documentElement.dataset.theme =
    theme === "light" || theme === "dark"
      ? theme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
})();
