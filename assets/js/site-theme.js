(function () {
  "use strict";

  var storageKey = "portfolio-colour-theme";
  var hideToggle = document.body.hasAttribute("data-hide-theme-toggle");
  var toggle = document.querySelector("#theme-toggle");

  if (hideToggle && toggle) {
    toggle.remove();
    toggle = null;
  }

  if (!toggle && !hideToggle) {
    toggle = document.createElement("button");
    toggle.id = "theme-toggle";
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.innerHTML = '<span class="icon solid fa-moon" aria-hidden="true"></span><span data-theme-toggle-label>Dark theme</span>';
    document.body.appendChild(toggle);
  }

  var navigation = document.querySelector("#nav");
  if (navigation && toggle && !navigation.contains(toggle)) navigation.appendChild(toggle);

  function normaliseTheme(value) {
    return value === "dark" ? "dark" : "light";
  }

  function setTheme(value) {
    var theme = normaliseTheme(value);
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme === "light");
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    toggle.querySelector("[data-theme-toggle-label]").textContent = dark ? "Light theme" : "Dark theme";
    var icon = toggle.querySelector(".icon");
    if (icon) icon.className = "icon solid " + (dark ? "fa-sun" : "fa-moon");
  }

  function savedTheme() {
    try { return localStorage.getItem(storageKey); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem(storageKey, value); } catch (error) { /* Storage is optional. */ }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      saveTheme(next);
    });
  }

  setTheme(savedTheme() || "light");

  window.portfolioTheme = {
    applyDefault: function (value) {
      if (!savedTheme()) setTheme(value === "dark" ? "dark" : "light");
    }
  };

  var script = document.currentScript || document.querySelector('script[src*="site-theme.js"]');
  if (script && script.src) {
    fetch(new URL("../../content/portfolio.json", script.src).href, { cache: "no-store" })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (content) {
        if (content && content.site) window.portfolioTheme.applyDefault(content.site.default_theme);
      })
      .catch(function () { /* The light fallback remains readable offline. */ });
  }
}());
