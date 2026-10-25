(function () {
  "use strict";

  var script = document.currentScript || document.querySelector('script[src*="site-navigation.js"]');
  if (!script || !script.src) return;

  var root = new URL("../../", script.src);
  var currentPath = window.location.pathname.replace(/index\.html$/, "");
  var nav = document.querySelector("#nav");
  if (!nav) return;

  function pageUrl(path) { return new URL(path, root).href; }
  function isCurrent(path) {
    return currentPath === new URL(path, root).pathname.replace(/index\.html$/, "");
  }

  var pages = [
    { label: "Home", path: "", activePath: "" },
    { label: "About", path: "about/", activePath: "about/" },
    { label: "Projects", path: "projects/", activePath: "projects/" },
    { label: "Samples", path: "samples/", activePath: "samples/" },
    { label: "Insights", path: "insights/", activePath: "insights/" },
    { label: "Contact", path: "contact/", activePath: "contact/" }
  ];

  nav.className = "top-navigation";
  nav.replaceChildren();

  var brand = document.createElement("a");
  brand.className = "nav-brand";
  brand.href = pageUrl("");
  brand.setAttribute("aria-label", "Segun Oluyi home");
  brand.innerHTML = '<span class="nav-brand-logo"><img data-site-brand-logo src="" alt="" hidden /><span class="nav-brand-mark" data-site-brand-mark>LOGO</span></span>';
  nav.appendChild(brand);

  // The desktop navigation moves into the mobile drawer. Keep a separate
  // brand in the visible mobile header so it stays on screen while scrolling.
  var mobileHeader = document.createElement("div");
  mobileHeader.className = "mobile-site-header";
  var mobileBrand = brand.cloneNode(true);
  mobileBrand.className = "mobile-site-brand";
  mobileHeader.appendChild(mobileBrand);
  nav.parentNode.insertBefore(mobileHeader, nav);

  var links = document.createElement("ul");
  links.className = "links";
  pages.forEach(function (page) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    var current = page.activePath !== null && isCurrent(page.activePath);
    link.href = pageUrl(page.path);
    link.textContent = page.label;
    if (current) {
      item.className = "active";
      link.setAttribute("aria-current", "page");
    }
    item.appendChild(link);
    links.appendChild(item);
  });
  nav.appendChild(links);

  if (!document.body.hasAttribute("data-hide-theme-toggle")) {
    var toggle = document.createElement("button");
    toggle.id = "theme-toggle";
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-label", "Switch to dark theme");
    toggle.innerHTML = '<span class="icon solid fa-moon" aria-hidden="true"></span><span data-theme-toggle-label>Dark theme</span>';
    nav.appendChild(toggle);
  }

  fetch(pageUrl("content/portfolio.json") + "?navigation=" + Date.now(), { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (content) {
      var site = content && content.site ? content.site : {};
      // main.js may move the shared navigation into its responsive panel.
      // Look from the document so the CMS logo is applied in either location.
      var images = document.querySelectorAll("[data-site-brand-logo]");
      var fallbacks = document.querySelectorAll("[data-site-brand-mark]");
      var favicon = document.querySelector("[data-site-favicon]");
      if (site.brand_logo) {
        images.forEach(function (image) {
          image.src = pageUrl(site.brand_logo) + "?v=" + Date.now();
          image.alt = site.brand_logo_alt || (site.brand_name ? site.brand_name + " logo" : "Portfolio logo");
          image.hidden = false;
        });
        fallbacks.forEach(function (fallback) { fallback.hidden = true; });
      } else if (site.brand_mark) {
        fallbacks.forEach(function (fallback) { fallback.textContent = site.brand_mark; });
      }
      if (favicon && site.favicon) {
        favicon.href = pageUrl(site.favicon) + "?v=" + Date.now();
        favicon.type = /\.svg(?:$|\?)/i.test(site.favicon) ? "image/svg+xml" : "image/png";
      }
    })
    .catch(function () { /* The static fallback stays usable if CMS content is unavailable. */ });
}());
