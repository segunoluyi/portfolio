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
  function keywords(insight) {
    var tags = Array.isArray(insight.tags) ? insight.tags.map(function (tag) { return String(tag || "").trim(); }).filter(Boolean) : [];
    if (tags.length) return tags;
    var category = String(insight.eyebrow || "").replace(/\s+(?:case study|article)$/i, "").trim();
    return category ? [category] : [];
  }

  function createCard(insight) {
    var article = document.createElement("article"), cover = document.createElement("div"), content = document.createElement("div"), heading = document.createElement("h2"), summary = document.createElement("p"), meta = document.createElement("div"), footer = document.createElement("div"), url = insight.url || "";
    article.className = "insight-blog-card";
    cover.className = "insight-blog-cover";
    content.className = "insight-blog-content";
    if (insight.image) {
      var image = document.createElement("img");
      image.src = versionedUrl(assetPath(insight.image)); image.alt = (insight.title || "Article") + " cover"; image.loading = "lazy";
      cover.classList.add("has-image"); cover.appendChild(image);
    } else { var placeholder = document.createElement("span"); placeholder.textContent = "Article image in preparation"; cover.appendChild(placeholder); }
    if (insight.eyebrow) { var category = document.createElement("span"); category.className = "insight-blog-category"; category.textContent = insight.eyebrow; content.appendChild(category); }
    if (url) {
      var title = document.createElement("a"), readMore = document.createElement("a");
      title.href = url; title.textContent = insight.title || "Untitled article";
      readMore.href = url; readMore.className = "insight-blog-read-more"; readMore.textContent = (insight.button_label || "Read article") + " →";
      if (/^https?:\/\//i.test(url)) [title, readMore].forEach(function (link) { link.target = "_blank"; link.rel = "noopener noreferrer"; });
      heading.appendChild(title); footer.appendChild(readMore);
    } else {
      heading.textContent = insight.title || "Untitled article";
    }
    summary.textContent = insight.summary || "";
    meta.className = "insight-blog-meta";
    if (insight.published_at && !isNaN(Date.parse(insight.published_at))) {
      var date = document.createElement("time"); date.dateTime = insight.published_at; date.textContent = new Date(insight.published_at).toLocaleDateString("en-GB", { year:"numeric", month:"short", day:"numeric", timeZone:"UTC" }); meta.appendChild(date);
    }
    if (Number.isInteger(Number(insight.read_minutes)) && Number(insight.read_minutes) > 0) {
      var readingTime = document.createElement("span"); readingTime.textContent = Number(insight.read_minutes) + " min read"; meta.appendChild(readingTime);
    }
    var author = document.createElement("span"); author.textContent = "By Segun Oluyi"; meta.appendChild(author);
    footer.className = "insight-blog-footer"; footer.appendChild(meta);
    content.append(heading, summary, footer); article.append(cover, content); return article;
  }

  function filteredInsights() { var term = (searchInput.value || "").trim().toLowerCase(), area = insightFilter.value; return allInsights.filter(function (insight) { var haystack = [insight.title, insight.eyebrow, insight.summary].concat(keywords(insight)).join(" ").toLowerCase(); return (!area || keywords(insight).includes(area)) && (!term || haystack.indexOf(term) !== -1); }); }
  function button(label, page, disabled) { var item = document.createElement("button"); item.type = "button"; item.className = "button small"; item.textContent = label; item.disabled = disabled; if (disabled && /^\d+$/.test(label)) item.setAttribute("aria-current", "page"); item.addEventListener("click", function () { currentPage = page; render(); }); return item; }
  function render() { var filtered = filteredInsights(), pages = Math.max(1, Math.ceil(filtered.length / pageSize)); currentPage = Math.min(currentPage, pages); grid.replaceChildren(); filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (insight) { grid.appendChild(createCard(insight)); }); resultsLabel.textContent = filtered.length + (filtered.length === 1 ? " article" : " articles") + " shown"; pagination.replaceChildren(); if (pages > 1) { pagination.appendChild(button("Previous", Math.max(1, currentPage - 1), currentPage === 1)); for (var page = 1; page <= pages; page += 1) pagination.appendChild(button(String(page), page, page === currentPage)); pagination.appendChild(button("Next", Math.min(pages, currentPage + 1), currentPage === pages)); } }

  fetch("../content/portfolio.json?cb=" + contentRevision, { cache: "no-store" }).then(function (response) { if (!response.ok) throw new Error(); return response.json(); }).then(function (content) { allInsights = (Array.isArray(content.insights) ? content.insights : []).map(function (item, index) { return { item: item, index: index }; }).sort(function (a, b) { var first = Date.parse(a.item.published_at || ""), second = Date.parse(b.item.published_at || ""); if (!isNaN(first) && !isNaN(second)) return second - first; if (!isNaN(first)) return -1; if (!isNaN(second)) return 1; return b.index - a.index; }).map(function (entry) { return entry.item; }); Array.from(new Set(allInsights.flatMap(keywords))).sort().forEach(function (area) { var option = document.createElement("option"); option.value = area; option.textContent = area; insightFilter.appendChild(option); }); searchInput.addEventListener("input", function () { currentPage = 1; render(); }); insightFilter.addEventListener("change", function () { currentPage = 1; render(); }); render(); }).catch(function () { resultsLabel.textContent = "Insights could not be loaded."; }).finally(function () { if (window.portfolioContentReady) window.portfolioContentReady(); });
}());
