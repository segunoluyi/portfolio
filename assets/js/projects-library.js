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
  var allProjects = [];
  var grid = document.querySelector("#projects-grid");
  var searchInput = document.querySelector("#project-search");
  var projectFilter = document.querySelector("#project-filter");
  var resultsLabel = document.querySelector("#project-results");
  var pagination = document.querySelector("#project-pagination");

  function createProjectCard(project) {
    var article = document.createElement("article");
    var header = document.createElement("header");
    var eyebrow = document.createElement("span");
    var heading = document.createElement("h2");
    var title = document.createElement("a");
    var media = document.createElement("div");
    var summary = document.createElement("p");
    var actions = document.createElement("ul");
    var links = [
      { url: project.case_study_url || project.url, label: project.case_study_label || project.button_label || "View case study" },
      { url: project.live_url, label: "Live dashboard" },
      { url: project.github_url, label: "View on GitHub" }
    ];
    var primaryUrl = project.case_study_url || project.url;
    var external = /^https?:\/\//i.test(primaryUrl || "");
    article.className = "project-card";
    eyebrow.className = "date";
    eyebrow.textContent = project.eyebrow || "Project";
    title.href = primaryUrl || "#";
    if (!primaryUrl) title.removeAttribute("href");
    title.textContent = project.title || "Untitled project";
    if (external) { title.target = "_blank"; title.rel = "noopener noreferrer"; }
    media.className = "project-card-media";
    if (project.image) {
      var image = document.createElement("img");
      image.src = versionedUrl(project.image.indexOf("images/") === 0 ? "../" + project.image : project.image);
      image.alt = project.image_alt || (project.title || "Portfolio project") + " cover image";
      image.loading = "lazy";
      media.appendChild(image);
    } else {
      var placeholder = document.createElement("span");
      placeholder.textContent = project.status || "Project documentation in preparation";
      media.classList.add("project-card-placeholder");
      media.appendChild(placeholder);
    }
    heading.appendChild(title); header.append(eyebrow, heading); summary.textContent = project.summary || "";
    actions.className = "actions project-card-actions";
    links.filter(function (link) { return link.url; }).forEach(function (link) {
      var item = document.createElement("li");
      var button = document.createElement("a");
      button.href = link.url;
      button.className = "button small";
      button.textContent = link.label;
      if (/^https?:\/\//i.test(link.url)) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
      item.appendChild(button); actions.appendChild(item);
    });
    if (Array.isArray(project.tools) && project.tools.length) {
      var tools = document.createElement("ul");
      tools.className = "project-card-tools";
      project.tools.forEach(function (tool) { var toolItem = document.createElement("li"); toolItem.textContent = tool; tools.appendChild(toolItem); });
      article.append(header, media, summary, tools, actions);
    } else article.append(header, media, summary, actions);
    return article;
  }

  function makeButton(label, page, disabled) {
    var button = document.createElement("button");
    button.type = "button"; button.className = "button small"; button.textContent = label; button.disabled = disabled;
    button.addEventListener("click", function () { currentPage = page; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    return button;
  }

  function getFilteredProjects() {
    var term = (searchInput.value || "").trim().toLowerCase();
    var area = projectFilter.value;
    return allProjects.filter(function (project) {
      var haystack = [project.title, project.eyebrow, project.summary].join(" ").toLowerCase();
      return (!area || project.eyebrow === area) && (!term || haystack.indexOf(term) !== -1);
    });
  }

  function render() {
    var filtered = getFilteredProjects();
    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    grid.replaceChildren();
    filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (project) { grid.appendChild(createProjectCard(project)); });
    resultsLabel.textContent = filtered.length + (filtered.length === 1 ? " project" : " projects") + " shown";
    pagination.replaceChildren();
    if (totalPages > 1) { pagination.appendChild(makeButton("Previous", Math.max(1, currentPage - 1), currentPage === 1)); for (var page = 1; page <= totalPages; page += 1) pagination.appendChild(makeButton(String(page), page, page === currentPage)); pagination.appendChild(makeButton("Next", Math.min(totalPages, currentPage + 1), currentPage === totalPages)); }
  }

  fetch("../content/portfolio.json?cb=" + contentRevision, { cache: "no-store" }).then(function (response) { if (!response.ok) throw new Error(); return response.json(); }).then(function (content) {
    if (window.portfolioTheme) window.portfolioTheme.applyDefault((content.site || {}).default_theme);
    allProjects = (Array.isArray(content.projects) ? content.projects : []).map(function (item, index) { return { item: item, index: index }; }).sort(function (firstEntry, secondEntry) { var firstDate = Date.parse(firstEntry.item.published_at || ""); var secondDate = Date.parse(secondEntry.item.published_at || ""); if (!isNaN(firstDate) && !isNaN(secondDate)) return secondDate - firstDate; if (!isNaN(firstDate)) return -1; if (!isNaN(secondDate)) return 1; return secondEntry.index - firstEntry.index; }).map(function (entry) { return entry.item; });
    Array.from(new Set(allProjects.map(function (project) { return project.eyebrow; }).filter(Boolean))).sort().forEach(function (area) { var option = document.createElement("option"); option.value = area; option.textContent = area; projectFilter.appendChild(option); });
    searchInput.addEventListener("input", function () { currentPage = 1; render(); });
    projectFilter.addEventListener("change", function () { currentPage = 1; render(); });
    render();
  }).catch(function () { resultsLabel.textContent = "Projects could not be loaded."; });
}());
