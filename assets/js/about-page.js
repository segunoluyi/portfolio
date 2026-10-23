(function () {
  "use strict";

  var root = document.documentElement;
  var page = document.querySelector("[data-about]");
  if (!page) return;

  var path = root.getAttribute("data-about-content-path") || "../content/about.json";
  var assetPrefix = root.getAttribute("data-asset-prefix") || "";
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function text(selector, value) {
    var element = page.querySelector(selector);
    if (element && typeof value === "string") element.textContent = value;
    return element;
  }

  function date(value) {
    var match = /^(\d{4})(?:-(\d{2}))?$/.exec(String(value || "").trim());
    if (!match) return String(value || "").trim();
    var month = Number(match[2]);
    return month >= 1 && month <= 12 ? monthNames[month - 1] + " " + match[1] : match[1];
  }

  function dateRange(job) {
    if (job.date_label) return job.date_label;
    var start = date(job.start_date);
    var end = job.current ? "present" : date(job.end_date);
    return [start, end].filter(Boolean).join("–");
  }

  function listText(value, key) {
    return typeof value === "string" ? value : value && typeof value[key] === "string" ? value[key] : "";
  }

  function renderSkill(group) {
    var card = document.createElement("section");
    var title = document.createElement("h3");
    var list = document.createElement("ul");
    card.className = "about-skill-card";
    title.textContent = group.title || "Skill area";
    (Array.isArray(group.skills) ? group.skills : []).forEach(function (value) {
      var skill = listText(value, "skill").trim();
      if (!skill) return;
      var item = document.createElement("li");
      item.textContent = skill;
      list.appendChild(item);
    });
    card.append(title, list);
    return card;
  }

  function renderJob(job) {
    var item = document.createElement("li");
    var label = dateRange(job);
    if (label) {
      var dateElement = document.createElement("span");
      dateElement.className = "about-timeline-date";
      dateElement.textContent = label;
      item.appendChild(dateElement);
    }
    var role = document.createElement("h3");
    role.textContent = job.role || "Role";
    item.appendChild(role);
    var place = [job.company, job.location].filter(Boolean).join(" · ");
    if (place) {
      var placeElement = document.createElement("p");
      placeElement.className = "about-timeline-place";
      placeElement.textContent = place;
      item.appendChild(placeElement);
    }
    var tasks = document.createElement("ul");
    tasks.className = "about-timeline-tasks";
    (Array.isArray(job.tasks) ? job.tasks : []).forEach(function (value) {
      var task = listText(value, "task").trim();
      if (!task) return;
      var taskItem = document.createElement("li");
      taskItem.textContent = task;
      tasks.appendChild(taskItem);
    });
    if (tasks.childElementCount) item.appendChild(tasks);
    return item;
  }

  fetch(path + (path.indexOf("?") === -1 ? "?" : "&") + "cb=" + Date.now(), { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("About content unavailable"); return response.json(); })
    .then(function (content) {
      text("[data-about-label]", content.label);
      text("[data-about-heading]", content.heading);
      text("[data-about-skills-heading]", content.skills_heading);
      text("[data-about-skills-intro]", content.skills_intro);
      text("[data-about-journey-heading]", content.journey_heading);
      text("[data-about-journey-intro]", content.journey_intro);

      var portrait = page.querySelector("[data-about-image]");
      if (portrait && content.portrait) {
        portrait.src = /^(?:[a-z]+:|\/)/i.test(content.portrait) ? content.portrait : assetPrefix + content.portrait;
      }
      if (portrait && content.portrait_alt) portrait.alt = content.portrait_alt;

      var summary = page.querySelector("[data-about-summary]");
      if (summary && typeof content.summary === "string") {
        summary.replaceChildren();
        content.summary.split(/\n\s*\n/).filter(Boolean).forEach(function (paragraph) {
          var element = document.createElement("p");
          element.textContent = paragraph.trim();
          summary.appendChild(element);
        });
      }

      var skills = page.querySelector("[data-about-skill-groups]");
      if (skills && Array.isArray(content.skill_groups)) {
        skills.replaceChildren();
        content.skill_groups.filter(function (group) { return group && group.title; }).forEach(function (group) { skills.appendChild(renderSkill(group)); });
      }

      var jobs = page.querySelector("[data-about-jobs]");
      if (jobs && Array.isArray(content.jobs)) {
        jobs.replaceChildren();
        content.jobs.filter(function (job) { return job && job.role; }).forEach(function (job) { jobs.appendChild(renderJob(job)); });
      }
    })
    .catch(function () { /* Keep the readable HTML fallback when offline. */ });
}());
