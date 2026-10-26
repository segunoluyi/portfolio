(function () {
  "use strict";
  var main = document.querySelector("[data-service-page]");
  if (!main) return;
  var script = document.currentScript;
  var root = new URL("../../", script.src);
  var services = [
    {
      slug: "analytics", icon: "fa-chart-bar", title: "Business Intelligence & Data Analytics",
      lead: "Turn scattered data into clear reporting and decisions you can act on.",
      audience: "For teams that need reliable numbers, useful dashboards, or a clearer view of performance.",
      deliverables: [
        ["Prepared data", "Cleaned, structured data with key definitions and assumptions documented."],
        ["Reports and dashboards", "Power BI or Excel views built around the questions and measures that matter to you."],
        ["Decision summary", "Plain-language findings, limitations, and recommended next steps."]
      ],
      steps: ["Define the business questions and available data.", "Prepare, analyse, and review the measures with you.", "Deliver the report or dashboard and explain how to use it."],
      proof: ["Customer complaints dashboard", "projects/"],
      note: "The scope depends on the quality and accessibility of your data. I will confirm the outputs before work begins."
    },
    {
      slug: "research", icon: "fa-search", title: "Market Research & Business Analysis",
      lead: "Understand a market, customer need, or business opportunity before you commit resources.",
      audience: "For founders and teams assessing an idea, entering a market, or trying to understand customers and competitors.",
      deliverables: [
        ["Research brief", "A clear question, scope, sources, and decision criteria."],
        ["Market and competitor picture", "Relevant evidence on demand, positioning, alternatives, and gaps."],
        ["Recommendations", "A concise explanation of what the evidence suggests and what to validate next."]
      ],
      steps: ["Agree on the decision the research should support.", "Gather and assess relevant primary or secondary sources.", "Present findings, uncertainties, and practical options."],
      proof: ["Browse work samples", "samples/"],
      note: "Research findings are tied to the available evidence; they are not a guarantee of market results."
    },
    {
      slug: "planning", icon: "fa-file-alt", title: "Business Planning & Development",
      lead: "Build a business plan or proposal that explains the opportunity and the numbers behind it.",
      audience: "For businesses preparing a launch, an internal plan, a funding conversation, or a growth decision.",
      deliverables: [
        ["Business narrative", "A structured explanation of the offer, market, operations, and strategy."],
        ["Financial model", "Assumption-led projections suited to the agreed purpose and available inputs."],
        ["Presentation-ready document", "A coherent plan or proposal with risks, milestones, and next steps."],
      ],
      steps: ["Discuss the audience, purpose, and information already available.", "Develop the research, assumptions, plan, and model.", "Review a draft together and deliver the agreed version."],
      proof: ["View business work samples", "samples/"],
      note: "Financial projections are scenarios based on stated assumptions, not promises of future performance."
    },
    {
      slug: "training", icon: "fa-chalkboard-teacher", title: "Training & Workshops",
      lead: "Help people learn analytics tools through guided practice and real business questions.",
      audience: "For individuals and teams developing practical Excel, Power BI, SQL, or reporting skills.",
      deliverables: [
        ["Learning plan", "A focused outline based on current skill level, goals, and time available."],
        ["Live practice", "Exercises and demonstrations using suitable data and business scenarios."],
        ["Reusable resources", "Notes, practice tasks, or templates agreed for the session."],
      ],
      steps: ["Identify learners, level, and desired outcomes.", "Agree on format, tools, duration, and exercises.", "Run the workshop and share follow-up resources."],
      proof: ["Learn about my experience", "about/"],
      note: "Sessions can be adapted for beginners or working teams after a short needs discussion."
    }
  ];
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function link(label, href, className) {
    var node = make("a", className, label);
    node.href = new URL(href, root).href;
    return node;
  }
  function heading(title) {
    var header = make("header", "service-page-header");
    header.appendChild(make("h1", "", title));
    return header;
  }
  function card(service) {
    var article = make("article", "service-directory-card");
    article.appendChild(make("span", "service-directory-icon icon solid " + service.icon));
    article.appendChild(make("h2", "", service.title));
    article.appendChild(make("p", "", service.lead));
    article.appendChild(link("Explore service", "services/" + service.slug + "/", "service-page-link"));
    return article;
  }
  var slug = main.getAttribute("data-service-page");
  var service = services.find(function (item) { return item.slug === slug; });
  main.replaceChildren();
  var wrap = make("article", "service-page-shell");
  if (!service) {
    wrap.appendChild(heading("Services"));
    wrap.appendChild(make("p", "service-page-lead", "Practical analysis, research, planning, and training shaped around the decision you need to make."));
    var grid = make("div", "service-directory-grid");
    services.forEach(function (item) { grid.appendChild(card(item)); });
    wrap.appendChild(grid);
    var overviewCta = make("section", "service-page-cta");
    overviewCta.appendChild(make("h2", "", "Not sure where to start?"));
    overviewCta.appendChild(make("p", "", "Tell me about the question or project, and we can identify a sensible first step."));
    overviewCta.appendChild(link("Get in touch", "contact/", "button primary"));
    wrap.appendChild(overviewCta);
  } else {
    wrap.appendChild(heading(service.title));
    wrap.appendChild(make("p", "service-page-lead", service.lead));
    var hero = make("div", "service-page-intro");
    hero.appendChild(make("p", "", service.audience));
    hero.appendChild(link("Discuss this service", "contact/?service=" + encodeURIComponent(service.title), "button primary"));
    wrap.appendChild(hero);
    var outcomes = make("section", "service-page-section");
    outcomes.appendChild(make("h2", "", "What you can expect"));
    var deliverables = make("div", "service-deliverable-grid");
    service.deliverables.forEach(function (item) {
      var block = make("article", "service-deliverable");
      block.appendChild(make("h3", "", item[0]));
      block.appendChild(make("p", "", item[1]));
      deliverables.appendChild(block);
    });
    outcomes.appendChild(deliverables);
    wrap.appendChild(outcomes);
    var process = make("section", "service-page-section");
    process.appendChild(make("h2", "", "How we would work"));
    var list = make("ol", "service-process");
    service.steps.forEach(function (step) { list.appendChild(make("li", "", step)); });
    process.appendChild(list);
    wrap.appendChild(process);
    var note = make("p", "service-scope-note", service.note);
    wrap.appendChild(note);
    var cta = make("section", "service-page-cta");
    cta.appendChild(make("h2", "", "Have a project in mind?"));
    cta.appendChild(make("p", "", "Share your goal, timeline, and what you already have. I’ll reply with the next questions and a practical way forward."));
    cta.appendChild(link("Get in touch", "contact/?service=" + encodeURIComponent(service.title), "button primary"));
    cta.appendChild(link(service.proof[0], service.proof[1], "service-proof-link"));
    wrap.appendChild(cta);
  }
  main.appendChild(wrap);
}());
