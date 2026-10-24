(function () {
  "use strict";

  // Fetch CMS content fresh, but keep image URLs stable so browsers can reuse cached covers.
  var contentRevision = String(Date.now());
  var documentRoot = document.documentElement;
  var contentPath = documentRoot.getAttribute("data-content-path") || "content/portfolio.json";
  var assetPrefix = documentRoot.getAttribute("data-asset-prefix") || "";
  function assetUrl(value) {
    if (!value || /^(?:[a-z]+:|\/)/i.test(value)) return value;
    return assetPrefix + value;
  }
  function versionedUrl(value) {
    if (!value || /^data:/i.test(value)) return value;
    return value;
  }

  function refreshedUrl(value) {
    if (!value || /^data:/i.test(value)) return value;
    return versionedUrl(value) + (value.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(contentRevision);
  }

  function setText(element, value) {
    if (element && value) element.textContent = value;
  }

  function cssUrl(value) {
    if (!value) return "";
    return 'url("' + String(value).replace(/["\\\n]/g, "").replace(/ /g, "%20") + '")';
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
    var content = document.createElement("div");
    var eyebrow = document.createElement("span");
    var heading = document.createElement("h2");
    var titleLink = document.createElement("a");
    var media = document.createElement("div");
    var summary = document.createElement("p");
    var overlay = document.createElement("div");
    var actions = document.createElement("div");
    var documentationUrl = project.github_url || project.case_study_url || project.url;
    var liveProjectUrl = project.live_url || project.project_url;
    var actionLinks = [
      { url: documentationUrl, label: project.github_url ? "View repo" : (project.case_study_label || project.button_label || "View documentation") },
      { url: liveProjectUrl, label: project.project_label || "View project" }
    ];
    var primaryUrl = documentationUrl;
    var opensExternally = /^https?:\/\//i.test(primaryUrl || "");

    article.className = "project-card showcase-project-card";
    content.className = "project-card-content";
    eyebrow.className = "project-card-eyebrow";
    eyebrow.textContent = project.eyebrow || "Project";
    titleLink.href = primaryUrl || "#";
    if (opensExternally && primaryUrl) { titleLink.target = "_blank"; titleLink.rel = "noopener noreferrer"; }
    if (!primaryUrl) titleLink.removeAttribute("href");
    titleLink.textContent = project.title || "Untitled project";
    heading.appendChild(titleLink);
    media.className = "project-card-media project-card-visual";
    if (project.image) {
      var image = document.createElement("img");
      image.src = versionedUrl(project.image);
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
    actionLinks.filter(function (item) { return item.url; }).forEach(function (item) {
      var button = document.createElement("a");
      button.href = item.url;
      button.className = "button small project-card-overlay-button";
      button.textContent = item.label;
      if (/^https?:\/\//i.test(item.url)) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
      actions.appendChild(button);
    });
    if (actions.children.length) {
      overlay.className = "project-card-overlay";
      overlay.appendChild(actions);
      media.appendChild(overlay);
    }
    summary.textContent = project.summary || "";
    content.append(eyebrow, heading, summary);
    if (Array.isArray(project.tools) && project.tools.length) {
      var tools = document.createElement("ul");
      tools.className = "project-card-tools";
      project.tools.slice(0, 5).forEach(function (tool) { var item = document.createElement("li"); item.textContent = tool; tools.appendChild(item); });
      content.appendChild(tools);
    }
    article.append(media, content);
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

  function createService(service, contact, index) {
    var article = document.createElement("article");
    var icon = document.createElement("span");
    var heading = document.createElement("h3");
    var points = document.createElement("ul");
    var link = document.createElement("a");
    article.className = "service-card";
    article.id = "service-" + (index + 1);
    icon.className = "service-icon icon solid " + (service.icon || "fa-check");
    heading.textContent = service.title || "Service";
    (Array.isArray(service.points) ? service.points : []).forEach(function (point) { var item = document.createElement("li"); item.textContent = point; points.appendChild(item); });
    link.className = "service-link";
    link.href = service.url || contact.primary_cta_url || (contact.email ? "mailto:" + contact.email : "#footer");
    link.textContent = service.button_label || "Request service";
    if (/^https?:\/\//i.test(link.href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
    article.append(icon, heading, points, link);
    return article;
  }

  function createServiceOverviewItem(labelText, detailText, href) {
    var link = document.createElement("a");
    var label = document.createElement("strong");
    var detail = document.createElement("span");
    link.href = href;
    var figure = /^([0-9][0-9,.]*[KMB]?\+?)(.*)$/i.exec(labelText);
    if (figure) {
      var number = document.createElement("span");
      number.className = "highlight-figure";
      number.textContent = figure[1];
      label.append(number, document.createTextNode(figure[2]));
    } else {
      label.textContent = labelText;
    }
    detail.textContent = detailText;
    link.append(label, detail);
    return link;
  }

  function renderServiceOverview(container, content) {
    if (!container) return;
    var documented = (Array.isArray(content.projects) ? content.projects : []).filter(function (project) {
      return Boolean(project.github_url || project.case_study_url || project.url);
    }).length;
    var planSamples = (Array.isArray(content.samples) ? content.samples : []).filter(function (sample) {
      return sample.content_type === "Business plan" && Boolean(sample.url || sample.slug);
    }).length;
    var services = Array.isArray(content.services) ? content.services.length : 0;
    var defaults = [
      { source: "custom", label_override: "150K+ ROWS ANALYSED", caption: "BI & DATA ANALYTICS", url: "projects/" },
      { source: "custom", label_override: "11+ INDUSTRIES ANALYSED", caption: "MARKET RESEARCH & BUSINESS ANALYSIS", url: "#services" },
      { source: "custom", label_override: "60+ PLANS & PROPOSALS", caption: "DEVELOPED FOR CLIENTS", url: "samples/" },
      { source: "custom", label_override: "10 COHORTS TRAINED", caption: "TRAINING & WORKSHOPS", url: "#services" }
    ];
    var highlights = Array.isArray(content.home_highlights) && content.home_highlights.length ? content.home_highlights : defaults;
    container.replaceChildren();
    highlights.slice(0, 4).forEach(function (item) {
      var automaticLabel = "";
      if (item.source === "documented_projects") automaticLabel = documented + (documented === 1 ? " CASE STUDY" : " CASE STUDIES");
      if (item.source === "plan_samples") automaticLabel = planSamples + (planSamples === 1 ? " PLAN SAMPLE" : " PLAN SAMPLES");
      if (item.source === "service_areas") automaticLabel = services + (services === 1 ? " SERVICE AREA" : " SERVICE AREAS");
      container.appendChild(createServiceOverviewItem(item.label_override || automaticLabel || "PORTFOLIO", item.caption || "", item.url || "#services"));
    });
  }

  function renderWorkflow(workflow) {
    var section = document.querySelector("[data-workflow]");
    if (!section || !workflow) return;
    setText(section.querySelector("[data-workflow-label]"), workflow.label);
    setText(section.querySelector("[data-workflow-heading]"), workflow.heading);
    setText(section.querySelector("[data-workflow-subtitle]"), workflow.subtitle);
    var list = section.querySelector("[data-workflow-steps]");
    if (!list || !Array.isArray(workflow.steps) || workflow.steps.length !== 4) return;
    list.replaceChildren();
    workflow.steps.forEach(function (step, index) {
      var item = document.createElement("li");
      var number = document.createElement("strong");
      var title = document.createElement("h3");
      var description = document.createElement("p");
      number.textContent = String(index + 1).padStart(2, "0");
      title.textContent = step.title || "Step";
      description.textContent = step.description || "";
      item.append(number, title, description);
      list.appendChild(item);
    });
  }

  var socialPlatforms = {
    email: { icon: "solid fa-envelope", label: "Email" },
    linkedin: { icon: "brands fa-linkedin-in", label: "LinkedIn" },
    github: { icon: "brands fa-github", label: "GitHub" },
    instagram: { icon: "brands fa-instagram", label: "Instagram" },
    x: { icon: "brands fa-twitter", label: "X" },
    facebook: { icon: "brands fa-facebook-f", label: "Facebook" },
    youtube: { icon: "brands fa-youtube", label: "YouTube" },
    whatsapp: { icon: "brands fa-whatsapp", label: "WhatsApp" },
    medium: { icon: "brands fa-medium", label: "Medium" },
    website: { icon: "solid fa-link", label: "Website" }
  };

  function socialLinks(contact, profile) {
    if (Array.isArray(contact.social_links) && contact.social_links.length) {
      return contact.social_links.filter(function (link) {
        return link && link.url && socialPlatforms[link.platform];
      }).slice(0, 5);
    }
    return [
      { platform: "email", url: contact.primary_cta_url || (contact.email ? "mailto:" + contact.email : ""), label: contact.primary_cta_label || "Email" },
      { platform: "linkedin", url: contact.linkedin_url || profile.linkedin_url || "" },
      { platform: "github", url: contact.github_url || "" }
    ].filter(function (link) { return link.url; });
  }

  function renderSocialLinks(container, links) {
    if (!container) return;
    container.replaceChildren();
    links.forEach(function (link) {
      var details = socialPlatforms[link.platform];
      if (!details) return;
      var item = document.createElement("li");
      var anchor = document.createElement("a");
      var label = link.label || details.label;
      anchor.href = link.url;
      anchor.className = "icon " + details.icon;
      anchor.setAttribute("aria-label", label);
      anchor.title = label;
      if (/^https?:\/\//i.test(link.url)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      var text = document.createElement("span");
      text.className = "label";
      text.textContent = label;
      anchor.appendChild(text);
      item.appendChild(anchor);
      container.appendChild(item);
    });
  }

  fetch(contentPath + (contentPath.indexOf("?") === -1 ? "?" : "&") + "cb=" + contentRevision, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Portfolio content could not be loaded.");
      return response.json();
    })
    .then(function (content) {
      var intro = document.querySelector("[data-portfolio-intro]");
      var grid = document.querySelector("#project-grid");
      var samplePreviewGrid = document.querySelector("#sample-preview-grid");
      var insightsGrid = document.querySelector("#insights-grid");
      var servicesGrid = document.querySelector("[data-services-grid]");
      var serviceOverview = document.querySelector("[data-service-overview]");
      var newsletterSection = document.querySelector("[data-newsletter]");
      var projectCardsSection = document.querySelector("[data-project-cards-section]");
      var site = content.site || {};
      var profile = content.profile || {};
      var contact = content.contact || {};

      if (servicesGrid && Array.isArray(content.services) && content.services.length) {
        servicesGrid.replaceChildren();
        content.services.forEach(function (service, index) {
          servicesGrid.appendChild(createService(service, contact, index));
        });
      }
      renderServiceOverview(serviceOverview, content);
      renderWorkflow(content.workflow);
      var whyWork = content.why_work || {};
      setText(document.querySelector("[data-why-heading]"), whyWork.heading);
      setText(document.querySelector("[data-impact-heading]"), whyWork.panel_heading);
      setText(document.querySelector("[data-impact-value]"), whyWork.impact_value);
      setText(document.querySelector("[data-impact-caption]"), whyWork.impact_caption);
      setText(document.querySelector("[data-expertise-heading]"), whyWork.expertise_heading);
      var benefitsList = document.querySelector("[data-why-benefits]");
      if (benefitsList && Array.isArray(whyWork.benefits) && whyWork.benefits.length) {
        benefitsList.replaceChildren();
        whyWork.benefits.slice(0, 4).forEach(function (benefit) {
          var card = document.createElement("article");
          var check = document.createElement("span");
          var content = document.createElement("div");
          var title = document.createElement("h3");
          var description = document.createElement("p");
          card.className = "why-benefit";
          check.className = "why-check icon solid fa-check";
          check.setAttribute("aria-hidden", "true");
          title.textContent = benefit.title || "";
          description.textContent = benefit.description || "";
          content.append(title, description);
          card.append(check, content);
          benefitsList.appendChild(card);
        });
      }
      var expertiseList = document.querySelector("[data-expertise-list]");
      if (expertiseList && Array.isArray(whyWork.expertise) && whyWork.expertise.length) {
        expertiseList.replaceChildren();
        whyWork.expertise.slice(0, 3).forEach(function (area) {
          var item = document.createElement("li");
          var icon = document.createElement("span");
          var content = document.createElement("div");
          var title = document.createElement("strong");
          var description = document.createElement("span");
          icon.className = "expertise-icon icon solid " + (["fa-chart-bar", "fa-search", "fa-chalkboard-teacher"].indexOf(area.icon) >= 0 ? area.icon : "fa-chart-bar");
          icon.setAttribute("aria-hidden", "true");
          title.textContent = area.title || "";
          description.textContent = area.description || "";
          content.append(title, description);
          item.append(icon, content);
          expertiseList.appendChild(item);
        });
      }

      if (window.portfolioTheme) window.portfolioTheme.applyDefault(site.default_theme);

      if (intro) {
        var heroTitle = intro.querySelector("[data-hero-title]");
        var heroName = intro.querySelector("[data-hero-name]");
        var heroKicker = intro.querySelector("[data-hero-kicker]");
        var heroImage = intro.querySelector("[data-hero-image]");
        var heroSummary = intro.querySelector("[data-hero-summary]");
        var heroSocialLinks = intro.querySelector("[data-hero-social-links]");
        var heroCv = intro.querySelector("[data-hero-cv]");
        var heroProjects = intro.querySelector("[data-hero-projects]");
        setText(heroTitle, profile.primary_title || profile.headline);
        setText(heroName, profile.name || "Segun Oluyi");
        setText(heroKicker, profile.hero_kicker);
        setText(heroSummary, profile.summary);
        setText(heroProjects, profile.projects_label || "View projects");
        if (heroImage && profile.headshot) {
          heroImage.src = versionedUrl(assetUrl(profile.headshot));
          heroImage.alt = profile.headshot_alt || (profile.name ? "Professional headshot of " + profile.name : "Professional headshot");
        }
        renderSocialLinks(heroSocialLinks, socialLinks(contact, profile));
        setText(heroCv, profile.cv_label || "Download CV");
        if (heroCv && profile.cv_url) {
          heroCv.href = profile.cv_url;
          heroCv.target = "_blank";
          heroCv.rel = "noopener noreferrer";
          heroCv.removeAttribute("aria-disabled");
          heroCv.removeAttribute("title");
          heroCv.classList.remove("disabled");
        }
      }

      var favicon = document.querySelector("[data-site-favicon]");
      if (favicon && site.favicon) {
        favicon.href = refreshedUrl(assetUrl(site.favicon));
        favicon.type = /\.svg(?:$|\?)/i.test(site.favicon) ? "image/svg+xml" : "image/png";
      }
      document.querySelectorAll("[data-site-brand-logo]").forEach(function (image) {
         var fallback = image.parentElement.querySelector("[data-site-brand-mark]");
         if (site.brand_logo) {
           image.src = refreshedUrl(assetUrl(site.brand_logo));
           image.alt = site.brand_logo_alt || (site.brand_name ? site.brand_name + " logo" : "Portfolio logo");
           image.hidden = false;
           if (fallback) fallback.hidden = true;
         } else {
           image.hidden = true;
           if (fallback) fallback.hidden = false;
         }
       });
      document.querySelectorAll("[data-site-brand-mark]").forEach(function (element) { setText(element, site.brand_mark); });

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

      if (newsletterSection) {
        var newsletter = content.newsletter || {};
        var newsletterLink = newsletterSection.querySelector("[data-newsletter-link]");
        setText(newsletterSection.querySelector("[data-newsletter-label]"), newsletter.label);
        setText(newsletterSection.querySelector("[data-newsletter-heading]"), newsletter.heading);
        setText(newsletterSection.querySelector("[data-newsletter-summary]"), newsletter.summary);
        if (newsletter.enabled && newsletter.subscribe_url) {
          newsletterSection.hidden = false;
          newsletterLink.href = newsletter.subscribe_url;
          newsletterLink.target = "_blank";
          newsletterLink.rel = "noopener noreferrer";
          setText(newsletterLink, newsletter.button_label || "Join the update list");
        }
      }

      renderSocialLinks(document.querySelector("[data-footer-social-links]"), socialLinks(contact, profile));
      setText(document.querySelector("[data-footer-tagline]"), profile.headline || profile.primary_title);
      setText(document.querySelector("[data-footer-heading]"), contact.footer_heading);

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
