(function () {
  "use strict";

  // Fetch CMS content fresh, but keep image URLs stable so browsers can reuse cached covers.
  var contentRevision = String(Date.now());
  function versionedUrl(value) {
    if (!value || /^data:/i.test(value)) return value;
    return value;
  }
  var pageSize = 6;
  var currentPage = 1;
  var allInsights = [];
  var grid = document.querySelector("#insights-grid");
  var searchInput = document.querySelector("#insight-search");
  var insightFilter = document.querySelector("#insight-filter");
  var resultsLabel = document.querySelector("#insight-results");
  var pagination = document.querySelector("#insight-pagination");

  function assetPath(path) { return path && path.indexOf("images/") === 0 ? "../" + path : path; }

  function createCard(insight) {
    var article = document.createElement("article"), cover = document.createElement("div"), content = document.createElement("div"), heading = document.createElement("h2"), summary = document.createElement("p"), url = insight.url || "";
    article.className = "project-card showcase-project-card insight-showcase-card";
    cover.className = "project-card-media project-card-visual insight-cover";
    content.className = "project-card-content";
    if (insight.image) {
      var image = document.createElement("img");
      image.src = versionedUrl(assetPath(insight.image)); image.alt = (insight.title || "Insight") + " cover"; image.loading = "lazy";
      cover.classList.add("has-image"); cover.appendChild(image);
    } else { var placeholder = document.createElement("span"); placeholder.textContent = "Article image in preparation"; cover.appendChild(placeholder); }
    if (url) {
      var overlay = document.createElement("div"), actions = document.createElement("div"), button = document.createElement("a"), title = document.createElement("a");
      button.className = "button small project-card-overlay-button"; button.href = url; button.textContent = insight.button_label || "Read article";
      title.href = url; title.textContent = insight.title || "Untitled insight";
      if (/^https?:\/\//i.test(url)) [button, title].forEach(function (link) { link.target = "_blank"; link.rel = "noopener noreferrer"; });
      actions.className = "project-card-overlay-actions"; overlay.className = "project-card-overlay";
      actions.appendChild(button); overlay.appendChild(actions); cover.appendChild(overlay); heading.appendChild(title);
    } else heading.textContent = insight.title || "Untitled insight";
    summary.textContent = insight.summary || ""; content.append(heading, summary);
    var tagLabels = [insight.eyebrow].concat(Array.isArray(insight.tags) ? insight.tags : [])
      .map(function (tag) { return String(tag || "").trim(); })
      .filter(function (tag, index, labels) { return tag && labels.findIndex(function (value) { return value.toLowerCase() === tag.toLowerCase(); }) === index; }).slice(0, 5);
    if (tagLabels.length) {
      var tags = document.createElement("ul"); tags.className = "project-card-tools";
      tagLabels.forEach(function (label) { var tag = document.createElement("li"); tag.textContent = label; tags.appendChild(tag); });
      content.appendChild(tags);
    }
    article.append(cover, content); return article;
  }

  function filteredInsights() { var term = (searchInput.value || "").trim().toLowerCase(), area = insightFilter.value; return allInsights.filter(function (insight) { var haystack = [insight.title, insight.eyebrow, insight.summary].concat(Array.isArray(insight.tags) ? insight.tags : []).join(" ").toLowerCase(); return (!area || insight.eyebrow === area) && (!term || haystack.indexOf(term) !== -1); }); }
  function button(label, page, disabled) { var item = document.createElement("button"); item.type = "button"; item.className = "button small"; item.textContent = label; item.disabled = disabled; if (disabled && /^\d+$/.test(label)) item.setAttribute("aria-current", "page"); item.addEventListener("click", function () { currentPage = page; render(); }); return item; }
  function render() { var filtered = filteredInsights(), pages = Math.max(1, Math.ceil(filtered.length / pageSize)); currentPage = Math.min(currentPage, pages); grid.replaceChildren(); filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (insight) { grid.appendChild(createCard(insight)); }); resultsLabel.textContent = filtered.length + (filtered.length === 1 ? " insight" : " insights") + " shown"; pagination.replaceChildren(); if (pages > 1) { pagination.appendChild(button("Previous", Math.max(1, currentPage - 1), currentPage === 1)); for (var page = 1; page <= pages; page += 1) pagination.appendChild(button(String(page), page, page === currentPage)); pagination.appendChild(button("Next", Math.min(pages, currentPage + 1), currentPage === pages)); } }

  fetch("../content/portfolio.json?cb=" + contentRevision, { cache: "no-store" }).then(function (response) { if (!response.ok) throw new Error(); return response.json(); }).then(function (content) { allInsights = (Array.isArray(content.insights) ? content.insights : []).map(function (item, index) { return { item: item, index: index }; }).sort(function (a, b) { var first = Date.parse(a.item.published_at || ""), second = Date.parse(b.item.published_at || ""); if (!isNaN(first) && !isNaN(second)) return second - first; if (!isNaN(first)) return -1; if (!isNaN(second)) return 1; return b.index - a.index; }).map(function (entry) { return entry.item; }); Array.from(new Set(allInsights.map(function (item) { return item.eyebrow; }).filter(Boolean))).sort().forEach(function (area) { var option = document.createElement("option"); option.value = area; option.textContent = area; insightFilter.appendChild(option); }); searchInput.addEventListener("input", function () { currentPage = 1; render(); }); insightFilter.addEventListener("change", function () { currentPage = 1; render(); }); render(); }).catch(function () { resultsLabel.textContent = "Insights could not be loaded."; }).finally(function () { if (window.portfolioContentReady) window.portfolioContentReady(); });
}());
