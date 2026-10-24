(function () {
  "use strict";

  var form = document.querySelector("#contact-form");
  if (!form) return;
  var status = document.querySelector("#contact-form-status");
  var submit = form.querySelector('button[type="submit"]');

  function safeEndpoint(value) {
    try {
      var url = new URL(value);
      return url.protocol === "https:" && url.hostname === "formspree.io" && /^\/f\/[a-zA-Z0-9]+$/.test(url.pathname) ? url.href : null;
    } catch (error) { return null; }
  }

  fetch("../content/portfolio.json?contact=" + Date.now(), { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (content) {
      var contact = content && content.contact ? content.contact : {};
      var email = document.querySelector("[data-page-contact-email]");
      var location = document.querySelector("[data-page-contact-location]");
      if (contact.email && email) { email.textContent = contact.email; email.href = "mailto:" + contact.email; }
      if (contact.location && location) location.textContent = contact.location;
      if (safeEndpoint(contact.form_endpoint)) form.action = safeEndpoint(contact.form_endpoint);
    })
    .catch(function () { /* Static contact details and endpoint remain available. */ });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = "Sending your message…";
    status.className = "contact-form-status";
    submit.disabled = true;
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        status.textContent = "Your message was sent. Thank you for getting in touch.";
        status.className = "contact-form-status is-success";
      })
      .catch(function () {
        status.textContent = "The message could not be sent. Please try again or email me directly.";
        status.className = "contact-form-status is-error";
      })
      .finally(function () { submit.disabled = false; });
  });
}());
