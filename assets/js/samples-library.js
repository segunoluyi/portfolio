(function () {
  "use strict";

  var pageSize = 12;
  var currentPage = 1;
  var allSamples = [];
  var grid = document.querySelector("#samples-grid");
  var searchInput = document.querySelector("#sample-search");
  var industryFilter = document.querySelector("#industry-filter");
  var resultsLabel = document.querySelector("#sample-results");
  var pagination = document.querySelector("#sample-pagination");

  function createSampleCard(sample) {
    var article = document.createElement("article");
    var header = document.createElement("header");
    var industry = document.createElement("span");
    var heading = document.createElement("h2");
    var link = document.createElement("a");
    var cover = document.createElement("div");
    var coverType = document.createElement("span");
    var coverTitle = document.createElement("strong");
    var summary = document.createElement("p");
    var actions = document.createElement("ul");
    var action = document.createElement("li");
    var button = document.createElement("a");

    industry.className = "date";
    industry.textContent = sample.industry || "Business plan sample";
    link.href = sample.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = sample.title || "Untitled sample";
    heading.appendChild(link);
    header.append(industry, heading);

    cover.className = "sample-cover";
    coverType.textContent = "Business plan sample";
    coverTitle.textContent = sample.title || "Sample";
    cover.append(coverType, coverTitle);

    summary.textContent = sample.summary || "";
    actions.className = "actions special";
    button.className = "button";
    button.href = sample.url || "#";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = sample.button_label || "View sample";
    action.appendChild(button);
    actions.appendChild(action);
    article.append(header, cover, summary, actions);
    return article;
  }

  function getFilteredSamples() {
    var term = (searchInput.value || "").trim().toLowerCase();
    var industry = industryFilter.value;
    return allSamples.filter(function (sample) {
      var haystack = [sample.title, sample.industry, sample.summary].join(" ").toLowerCase();
      return (!industry || sample.industry === industry) && (!term || haystack.indexOf(term) !== -1);
    });
  }

  function makePageButton(label, page, disabled) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "button small";
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener("click", function () { currentPage = page; render(); });
    return button;
  }

  function render() {
    var filtered = getFilteredSamples();
    var pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    var start = (currentPage - 1) * pageSize;
    var visible = filtered.slice(start, start + pageSize);

    grid.replaceChildren();
    if (visible.length) visible.forEach(function (sample) { grid.appendChild(createSampleCard(sample)); });
    else {
      var empty = document.createElement("p");
      empty.textContent = "No samples match this filter yet.";
      grid.appendChild(empty);
    }

    resultsLabel.textContent = filtered.length + (filtered.length === 1 ? " sample" : " samples") + " shown";
    pagination.replaceChildren();
    if (pageCount > 1) {
      pagination.appendChild(makePageButton("Previous", Math.max(1, currentPage - 1), currentPage === 1));
      for (var page = 1; page <= pageCount; page += 1) pagination.appendChild(makePageButton(String(page), page, page === currentPage));
      pagination.appendChild(makePageButton("Next", Math.min(pageCount, currentPage + 1), currentPage === pageCount));
    }
  }

  fetch("../content/portfolio.json", { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("Samples could not be loaded."); return response.json(); })
    .then(function (content) {
      allSamples = Array.isArray(content.samples) ? content.samples : [];
      Array.from(new Set(allSamples.map(function (sample) { return sample.industry; }).filter(Boolean))).sort().forEach(function (industry) {
        var option = document.createElement("option");
        option.value = industry;
        option.textContent = industry;
        industryFilter.appendChild(option);
      });
      searchInput.addEventListener("input", function () { currentPage = 1; render(); });
      industryFilter.addEventListener("change", function () { currentPage = 1; render(); });
      render();
    })
    .catch(function () {
      resultsLabel.textContent = "Samples could not be loaded.";
    });
}());
