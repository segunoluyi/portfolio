(function () {
  "use strict";

  var root = document.documentElement;
  var layoutKey = "portfolio-page-layout:" + location.pathname;
  var pending = /\/about\/?(?:index\.html)?$/.test(location.pathname) ? 2 : 1;
  var ready = 0;
  var savedScroll = null;
  var navigation = performance.getEntriesByType("navigation")[0];
  var restoringReload = navigation && navigation.type === "reload";

  try {
    root.dataset.theme = localStorage.getItem("portfolio-colour-theme") === "dark" ? "dark" : "light";
  } catch (error) {
    root.dataset.theme = "light";
  }

  root.classList.add("portfolio-content-loading");
  try {
    var layout = JSON.parse(sessionStorage.getItem(layoutKey));
    if (layout && Math.abs(layout.width - innerWidth) < 40 && layout.height > 0) {
      root.style.setProperty("--portfolio-loading-main-height", layout.height + "px");
      if (restoringReload && Number.isFinite(layout.scrollY)) savedScroll = layout.scrollY;
    }
  } catch (error) { /* Storage is optional. */ }

  if (savedScroll !== null) {
    history.scrollRestoration = "manual";
    document.addEventListener("DOMContentLoaded", function () { scrollTo(0, savedScroll); }, { once: true });
  }

  function saveHeight() {
    var main = document.querySelector("#main");
    if (!main || root.classList.contains("portfolio-content-loading")) return;
    try {
      sessionStorage.setItem(layoutKey, JSON.stringify({
        width: innerWidth,
        height: Math.ceil(main.getBoundingClientRect().height),
        scrollY: scrollY
      }));
    } catch (error) { /* Rendering does not depend on storage. */ }
  }

  window.portfolioContentReady = function () {
    ready += 1;
    if (ready < pending) return;
    root.classList.remove("portfolio-content-loading");
    if (savedScroll !== null) scrollTo(0, savedScroll);
    requestAnimationFrame(saveHeight);
  };
  window.addEventListener("pagehide", function () {
    saveHeight();
    if (savedScroll !== null) history.scrollRestoration = "auto";
  });
}());
