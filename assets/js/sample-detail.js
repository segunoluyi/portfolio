(function () {
  "use strict";

  var slug = document.body.getAttribute("data-sample-slug");
  var title = document.querySelector("[data-sample-title]");
  var type = document.querySelector("[data-sample-type]");
  var industry = document.querySelector("[data-sample-industry]");
  var summary = document.querySelector("[data-sample-summary]");
  var coverType = document.querySelector("[data-sample-cover-type]");
  var coverTitle = document.querySelector("[data-sample-cover-title]");
  var documentLink = document.querySelector("[data-sample-document-link]");
  var caseStudyAction = document.querySelector("[data-sample-case-study-action]");
  var caseStudyLink = document.querySelector("[data-sample-case-study-link]");
  var message = document.querySelector("[data-sample-message]");

  fetch("../../content/portfolio.json", { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("Sample could not be loaded."); return response.json(); })
    .then(function (content) {
      var samples = Array.isArray(content.samples) ? content.samples : [];
      var sample = samples.find(function (item) { return item.slug === slug; });
      if (!sample) throw new Error("Sample could not be found.");

      document.title = (sample.title || "Work sample") + " | Segun Oluyi";
      if (title) title.textContent = sample.title || "Work sample";
      if (type) type.textContent = sample.content_type || "Work sample";
      if (industry) industry.textContent = sample.industry || "";
      if (summary) summary.textContent = sample.summary || "";
      if (coverType) coverType.textContent = sample.content_type || "Work sample";
      if (coverTitle) coverTitle.textContent = sample.title || "Work sample";
      if (documentLink && sample.url) {
        documentLink.href = sample.url;
        documentLink.target = "_blank";
        documentLink.rel = "noopener noreferrer";
      }
      if (caseStudyAction && caseStudyLink && sample.case_study_url) {
        caseStudyLink.href = sample.case_study_url;
        caseStudyAction.hidden = false;
      }
    })
    .catch(function () {
      if (title) title.textContent = "Sample unavailable";
      if (message) message.textContent = "This sample page is not available at the moment. Please return to the Work Samples Library.";
      if (documentLink) documentLink.hidden = true;
    });
}());
