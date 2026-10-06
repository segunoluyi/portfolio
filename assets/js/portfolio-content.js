(function () {
  "use strict";

  // Fetch CMS content fresh, but keep image URLs stable so browsers can reuse cached covers.
  var contentRevision = String(Date.now());
  function versionedUrl(value) {
    if (!value || /^data:/i.test(value)) return value;
    return value;
  }

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
    image.src = versionedUrl(project.image || "images/pic02.jpg");
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
    var summary = document.createElement("p");
    var actions = document.createElement("ul");
    var action = document.createElement("li");
    var button = document.createElement("a");
    var detailUrl = sample.slug ? "samples/" + sample.slug + "/" : "samples/";

    industry.className = "date";
    industry.textContent = sample.industry || "Work sample";
    titleLink.href = detailUrl;
    titleLink.textContent = sample.title || "Untitled sample";
    heading.appendChild(titleLink);
    header.append(industry, heading);

    cover.className = "sample-cover";
    if (sample.cover_image) {
      var image = document.createElement("img");
      image.src = versionedUrl(sample.cover_image);
      image.alt = sample.cover_alt || (sample.title || "Work sample") + " document cover";
      image.loading = "lazy";
      cover.classList.add("has-image");
      cover.appendChild(image);
    } else {
      var coverType = document.createElement("span");
      var coverTitle = document.createElement("strong");
      coverType.textContent = sample.content_type || "Work sample";
      coverTitle.textContent = sample.title || "Sample";
      cover.append(coverType, coverTitle);
    }

    summary.textContent = sample.summary || "";
    actions.className = "actions special";
    button.className = "button";
    button.href = detailUrl;
    button.textContent = sample.button_label || "View sample";
    if (!sample.slug) button.setAttribute("aria-disabled", "true");
    action.appendChild(button);
    actions.appendChild(action);
    article.append(header, cover, summary, actions);
    return article;
  }

  fetch("content/portfolio.json?cb=" + contentRevision, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Portfolio content could not be loaded.");
      return response.json();
    })
    .then(function (content) {
      var intro = document.querySelector("[data-portfolio-intro]");
      var grid = document.querySelector("#project-grid");
      var about = document.querySelector("[data-about]");
      var samplePreviewGrid = document.querySelector("#sample-preview-grid");
      var insightsGrid = document.querySelector("#insights-grid");
      var skillsGrid = document.querySelector("[data-skills-grid]");
	  var projectCardsSection = document.querySelector("[data-project-cards-section]");
      var profile = content.profile || {};
      var aboutContent = content.about || {};
      var contact = content.contact || {};

      if (intro) {
        var heroTitle = intro.querySelector("[data-hero-title]");
        var heroName = intro.querySelector("[data-hero-name]");
        var heroFocus = intro.querySelector("[data-hero-focus]");
        var heroSummary = intro.querySelector("[data-hero-summary]");
        var heroEmail = intro.querySelector("[data-hero-email]");
        var heroCv = intro.querySelector("[data-hero-cv]");
        setText(heroTitle, profile.primary_title || profile.headline);
        setText(heroName, profile.name ? "Hi, I’m " + profile.name + "." : "Hi, I’m Segun Oluyi.");
        setText(heroFocus, profile.focus_areas);
        setText(heroSummary, profile.summary);
        if (heroEmail && contact.email) heroEmail.href = "mailto:" + contact.email;
        if (heroCv && profile.cv_url) {
          heroCv.href = profile.cv_url;
          heroCv.removeAttribute("aria-disabled");
          heroCv.removeAttribute("title");
          heroCv.classList.remove("disabled");
        }
      }

      if (about) {
        var aboutHeading = about.querySelector("h2");
        var aboutSummary = about.querySelector("p");
        setText(aboutHeading, aboutContent.heading);
        setText(aboutSummary, aboutContent.summary);
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
        newestFirst(content.insights).slice(0, 6).forEach(function (insight) { insightsGrid.appendChild(createProject(insight)); });
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
