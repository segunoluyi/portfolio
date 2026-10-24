(function () {
  "use strict";

  var contentRevision = String(Date.now());
  var pageSize = 9;
  var currentPage = 1;
  var allProjects = [];
  var grid = document.querySelector("#projects-grid");
  var pagination = document.querySelector("#project-pagination");

  function versionedUrl(value) {
    if (!value || /^data:/i.test(value)) return value;
    return value;
  }

  function createProjectCard(project) {
    var article = document.createElement("article");
    var content = document.createElement("div");
    var heading = document.createElement("h2");
    var title = document.createElement("a");
    var media = document.createElement("div");
    var summary = document.createElement("p");
    var overlay = document.createElement("div");
    var actions = document.createElement("div");
    // Keep the hover treatment purposeful: one link explains the work and
    // one link opens the finished project, dashboard, or repository.
    var documentationUrl = project.github_url || project.case_study_url || project.url;
    var liveProjectUrl = project.live_url || project.project_url;
    var links = [
      { url: documentationUrl, label: project.github_url ? "View repo" : (project.case_study_label || project.button_label || "View documentation") },
      { url: liveProjectUrl, label: project.project_label || "View project" }
    ];
    var primaryUrl = documentationUrl;
    var external = /^https?:\/\//i.test(primaryUrl || "");

    article.className = "project-card showcase-project-card";
    content.className = "project-card-content";
    title.href = primaryUrl || "#";
    if (!primaryUrl) title.removeAttribute("href");
    title.textContent = project.title || "Untitled project";
    if (external) { title.target = "_blank"; title.rel = "noopener noreferrer"; }
    heading.appendChild(title);

    media.className = "project-card-media project-card-visual";
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

    actions.className = "project-card-overlay-actions";
    links.filter(function (link) { return link.url; }).forEach(function (link) {
      var button = document.createElement("a");
      button.href = link.url;
      button.className = "button small project-card-overlay-button";
      button.textContent = link.label;
      if (/^https?:\/\//i.test(link.url)) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
      actions.appendChild(button);
    });
    if (actions.children.length) {
      overlay.className = "project-card-overlay";
      overlay.appendChild(actions);
      media.appendChild(overlay);
    }

    summary.textContent = project.summary || "";
    content.append(heading, summary);
    if (Array.isArray(project.tools) && project.tools.length) {
      var tools = document.createElement("ul");
      tools.className = "project-card-tools";
      project.tools.slice(0, 5).forEach(function (tool) {
        var toolItem = document.createElement("li");
        toolItem.textContent = tool;
        tools.appendChild(toolItem);
      });
      content.appendChild(tools);
    }
    article.append(media, content);
    return article;
  }

  function makeButton(label, page, disabled) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "button small";
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener("click", function () {
      currentPage = page;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return button;
  }

  function render() {
    var totalPages = Math.max(1, Math.ceil(allProjects.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    grid.replaceChildren();
    allProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (project) {
      grid.appendChild(createProjectCard(project));
    });
    if (!pagination) return;
    pagination.replaceChildren();
    if (totalPages > 1) {
      pagination.appendChild(makeButton("Previous", Math.max(1, currentPage - 1), currentPage === 1));
      for (var page = 1; page <= totalPages; page += 1) pagination.appendChild(makeButton(String(page), page, page === currentPage));
      pagination.appendChild(makeButton("Next", Math.min(totalPages, currentPage + 1), currentPage === totalPages));
    }
    grid.classList.add("is-loaded");
    try {
      sessionStorage.setItem("portfolio-projects-grid-layout", JSON.stringify({ width: innerWidth, height: Math.ceil(grid.getBoundingClientRect().height) }));
    } catch (error) { /* Rendering does not depend on storage. */ }
  }

  fetch("../content/portfolio.json?cb=" + contentRevision, { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error(); return response.json(); })
    .then(function (content) {
      if (window.portfolioTheme) window.portfolioTheme.applyDefault((content.site || {}).default_theme);
      allProjects = (Array.isArray(content.projects) ? content.projects : []).map(function (item, index) {
        return { item: item, index: index };
      }).sort(function (firstEntry, secondEntry) {
        var firstDate = Date.parse(firstEntry.item.published_at || "");
        var secondDate = Date.parse(secondEntry.item.published_at || "");
        if (!isNaN(firstDate) && !isNaN(secondDate)) return secondDate - firstDate;
        if (!isNaN(firstDate)) return -1;
        if (!isNaN(secondDate)) return 1;
        return secondEntry.index - firstEntry.index;
      }).map(function (entry) { return entry.item; });
      render();
    })
    .catch(function () { grid.classList.add("is-loaded"); grid.textContent = "Projects could not be loaded."; });
}());
