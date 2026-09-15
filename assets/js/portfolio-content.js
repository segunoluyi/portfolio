(function () {
  "use strict";

  function setText(element, value) {
    if (element && value) element.textContent = value;
  }

  function newestFirst(items) {
    return items.map(function (item, index) { return { item: item, index: index }; }).sort(function (firstEntry, secondEntry) {
      var first = firstEntry.item;
      var second = secondEntry.item;
      var firstDate = Date.parse(first.published_at || "");
      var secondDate = Date.parse(second.published_at || "");
      if (!isNaN(firstDate) && !isNaN(secondDate)) return secondDate - firstDate;
      if (!isNaN(firstDate)) return -1;
      if (!isNaN(secondDate)) return 1;
      return secondEntry.index - firstEntry.index;
    }).map(function (entry) { return entry.item; });
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
    var opensExternally = /^https?:\/\//i.test(project.url || "");

    eyebrow.className = "date";
    eyebrow.textContent = project.eyebrow || "Project";
    titleLink.href = project.url || "#";
    if (opensExternally) { titleLink.target = "_blank"; titleLink.rel = "noopener noreferrer"; }
    titleLink.textContent = project.title || "Untitled project";
    heading.appendChild(titleLink);
    header.append(eyebrow, heading);
    imageLink.href = project.url || "#";
    if (opensExternally) { imageLink.target = "_blank"; imageLink.rel = "noopener noreferrer"; }
    imageLink.className = "image fit";
    image.src = project.image || "images/pic02.jpg";
    image.alt = project.title || "Portfolio project";
    imageLink.appendChild(image);
    summary.textContent = project.summary || "";
    actions.className = "actions special";
    button.href = project.url || "#";
    if (opensExternally) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
    button.className = "button";
    button.textContent = project.button_label || "View project";
    if (!project.url) button.setAttribute("aria-disabled", "true");
    action.appendChild(button);
    actions.appendChild(action);
    article.append(header, imageLink, summary, actions);
    return article;
  }

  function createSample(sample) {
    var article = document.createElement("article");
    var header = document.createElement("header");
    var industry = document.createElement("span");
    var heading = document.createElement("h2");
    var titleLink = document.createElement("a");
    var cover = document.createElement("div");
    var coverType = document.createElement("span");
    var coverTitle = document.createElement("strong");
    var summary = document.createElement("p");
    var actions = document.createElement("ul");
    var action = document.createElement("li");
    var button = document.createElement("a");
    var url = sample.url || "#";

    industry.className = "date";
    industry.textContent = sample.industry || "Business plan sample";
    titleLink.href = url;
    if (sample.url) { titleLink.target = "_blank"; titleLink.rel = "noopener noreferrer"; }
    titleLink.textContent = sample.title || "Untitled sample";
    heading.appendChild(titleLink);
    header.append(industry, heading);

    cover.className = "sample-cover";
    coverType.textContent = "Business plan sample";
    coverTitle.textContent = sample.title || "Sample";
    cover.append(coverType, coverTitle);

    summary.textContent = sample.summary || "";
    actions.className = "actions special";
    button.className = "button";
    button.href = url;
    button.textContent = sample.button_label || "View sample";
    if (sample.url) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
    else { button.setAttribute("aria-disabled", "true"); }
    action.appendChild(button);
    actions.appendChild(action);
    article.append(header, cover, summary, actions);
    return article;
  }

  fetch("content/portfolio.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Portfolio content could not be loaded.");
      return response.json();
    })
    .then(function (content) {
      var intro = document.querySelector("[data-portfolio-intro]");
      var grid = document.querySelector("#project-grid");
      var samplePreviewGrid = document.querySelector("#sample-preview-grid");
      var insightsGrid = document.querySelector("#insights-grid");
      var skillsGrid = document.querySelector("[data-skills-grid]");
	  var projectCardsSection = document.querySelector("[data-project-cards-section]");
      var profile = content.profile || {};
      var contact = content.contact || {};

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

      if (grid && Array.isArray(content.projects)) {
        grid.replaceChildren();
        newestFirst(content.projects).slice(0, 6).forEach(function (project) { grid.appendChild(createProject(project)); });
		if (projectCardsSection) projectCardsSection.hidden = content.projects.length === 0;
		grid.hidden = content.projects.length === 0;
      }

      if (samplePreviewGrid && Array.isArray(content.samples)) {
        samplePreviewGrid.replaceChildren();
        newestFirst(content.samples).slice(0, 6).forEach(function (sample) { samplePreviewGrid.appendChild(createSample(sample)); });
      }

      if (insightsGrid && Array.isArray(content.insights)) {
        insightsGrid.replaceChildren();
        content.insights.forEach(function (insight) { insightsGrid.appendChild(createProject(insight)); });
      }

      if (skillsGrid && Array.isArray(content.skills)) {
        skillsGrid.replaceChildren();
        content.skills.forEach(function (skill) {
          var item = document.createElement("li");
          item.textContent = skill;
          skillsGrid.appendChild(item);
        });
      }

      var location = document.querySelector("[data-contact-location]");
      var phone = document.querySelector("[data-contact-phone]");
      var email = document.querySelector("[data-contact-email]");
      var github = document.querySelector("[data-contact-github]");
      setText(location, contact.location);
      if (phone && contact.phone) {
        phone.href = "tel:" + contact.phone.replace(/[^\d+]/g, "");
        setText(phone, contact.phone);
      }
      if (email && contact.email) {
        email.href = "mailto:" + contact.email;
        setText(email, contact.email);
      }
      if (github && contact.github_url) {
        github.href = contact.github_url;
        github.target = "_blank";
        github.rel = "noopener noreferrer";
      }
    })
    .catch(function (error) {
      console.warn(error.message);
    });
}());
