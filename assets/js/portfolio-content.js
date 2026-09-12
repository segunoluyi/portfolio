(function () {
  "use strict";

  function setText(element, value) {
    if (element && value) element.textContent = value;
  }

  function createProject(project) {
    var article = document.createElement("article");
    var header = document.createElement("header");
    var eyebrow = document.createElement("span");
    var heading = document.createElement("h2");
    var titleLink = document.createElement("a");
    var imageLink = document.createElement("a");
    var image = document.createElement("img");
    var summary = document.createElement("p");
    var actions = document.createElement("ul");
    var action = document.createElement("li");
    var button = document.createElement("a");

    eyebrow.className = "date";
    eyebrow.textContent = project.eyebrow || "Project";
    titleLink.href = project.url || "#";
    titleLink.textContent = project.title || "Untitled project";
    heading.appendChild(titleLink);
    header.append(eyebrow, heading);
    imageLink.href = project.url || "#";
    imageLink.className = "image fit";
    image.src = project.image || "images/pic02.jpg";
    image.alt = project.title || "Portfolio project";
    imageLink.appendChild(image);
    summary.textContent = project.summary || "";
    actions.className = "actions special";
    button.href = project.url || "#";
    button.className = "button";
    button.textContent = project.button_label || "View project";
    if (!project.url) button.setAttribute("aria-disabled", "true");
    action.appendChild(button);
    actions.appendChild(action);
    article.append(header, imageLink, summary, actions);
    return article;
  }

  fetch("content/portfolio.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Portfolio content could not be loaded.");
      return response.json();
    })
    .then(function (content) {
      var intro = document.querySelector("[data-portfolio-intro]");
      var featured = document.querySelector("#featured-project");
      var grid = document.querySelector("#project-grid");
      var profile = content.profile || {};
      var featuredProject = content.featured_project || {};

      if (intro) {
        var introHeading = intro.querySelector("h1");
        var introParagraph = intro.querySelector("p");
        if (introHeading) introHeading.innerHTML = (profile.name || "Segun Oluyi") + "<br />Portfolio";
        if (introParagraph) {
          introParagraph.replaceChildren(document.createTextNode([profile.headline, profile.summary].filter(Boolean).join(" ") + " "));
          var linkedIn = document.createElement("a");
          linkedIn.href = profile.linkedin_url || "#";
          linkedIn.textContent = profile.linkedin_label || "LinkedIn";
          introParagraph.appendChild(linkedIn);
        }
      }

      if (featured) {
        var title = featured.querySelector("h2 a");
        var articleImage = featured.querySelector(".image.main img");
        var articleImageLink = featured.querySelector(".image.main");
        var description = featured.querySelector("p");
        var articleButton = featured.querySelector(".button.large");
        if (title) { title.href = featuredProject.url || "#"; setText(title, featuredProject.title); }
        if (articleImage) { articleImage.src = featuredProject.image || articleImage.src; articleImage.alt = featuredProject.title || "Featured project"; }
        if (articleImageLink) articleImageLink.href = featuredProject.url || "#";
        setText(description, featuredProject.summary);
        if (articleButton) { articleButton.href = featuredProject.url || "#"; setText(articleButton, featuredProject.button_label || "View project"); }
      }

      if (grid && Array.isArray(content.projects)) {
        grid.replaceChildren();
        content.projects.forEach(function (project) { grid.appendChild(createProject(project)); });
      }
    })
    .catch(function (error) {
      console.warn(error.message);
    });
}());
