(function () {
  "use strict";

  var script = document.currentScript;
  var contentUrl = new URL("../../content/portfolio.json", script.src);
  var icons = {
    email: "solid fa-envelope",
    linkedin: "brands fa-linkedin-in",
    github: "brands fa-github",
    x: "brands fa-x-twitter",
    website: "solid fa-link"
  };

  fetch(contentUrl, { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("Footer content unavailable"); return response.json(); })
    .then(function (content) {
      var profile = content.profile || {};
      var contact = content.contact || {};
      var tagline = document.querySelector("#footer [data-footer-tagline]");
      var heading = document.querySelector("#footer [data-footer-heading]");
      var location = document.querySelector("#footer [data-contact-location]");
      var phone = document.querySelector("#footer [data-contact-phone]");
      var email = document.querySelector("#footer [data-contact-email]");
      var socials = document.querySelector("#footer [data-footer-social-links]");
      if (tagline) tagline.textContent = profile.headline || profile.primary_title || tagline.textContent;
      if (heading) heading.textContent = contact.footer_heading || heading.textContent;
      if (location) location.textContent = contact.location || location.textContent;
      if (phone && contact.phone) {
        phone.textContent = contact.phone;
        phone.href = "tel:" + contact.phone.replace(/[^\d+]/g, "");
      }
      if (email && contact.email) {
        email.textContent = contact.email;
        email.href = "mailto:" + contact.email;
      }
      if (!socials) return;
      var links = Array.isArray(contact.social_links) && contact.social_links.length ? contact.social_links : [
        { platform: "email", url: contact.primary_cta_url || (contact.email && "mailto:" + contact.email), label: "Email" },
        { platform: "linkedin", url: contact.linkedin_url || profile.linkedin_url, label: "LinkedIn" },
        { platform: "github", url: contact.github_url, label: "GitHub" }
      ];
      socials.replaceChildren();
      links.filter(function (link) { return link && link.url && icons[link.platform]; }).slice(0, 5).forEach(function (link) {
        var item = document.createElement("li");
        var anchor = document.createElement("a");
        var label = link.label || link.platform;
        anchor.href = link.url;
        anchor.className = "icon " + icons[link.platform];
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
        socials.appendChild(item);
      });
    })
    .catch(function () { /* Keep the static contact details when offline. */ });
}());
