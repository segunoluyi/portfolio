(function () {
  "use strict";

  CMS.registerPreviewStyle(`
    * { box-sizing: border-box; }
    :root { --page:#0b0717; --surface:#17122a; --surface-soft:#211b37; --text:#f8f6ff; --muted:#aaa3bb; --accent:#a89be2; --border:#302947; }
    body { margin:0; background:var(--page); color:var(--text); font-family:"Segoe UI",Arial,sans-serif; }
    .portfolio-preview { margin:0 auto; min-height:100vh; max-width:1120px; background:var(--page); }
    .portfolio-preview.is-light { --page:#f4f7f8; --surface:#fff; --surface-soft:#eef3f5; --text:#18242d; --muted:#667581; --accent:#1496ad; --border:#dbe4e8; }
    .portfolio-preview__hero { padding:44px 42px; text-align:center; }
    .portfolio-preview__eyebrow { color:var(--accent); font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
    .portfolio-preview h1 { margin:10px 0; font-size:36px; line-height:1.1; }
    .portfolio-preview__hero p { color:var(--muted); line-height:1.6; margin:0 auto; max-width:680px; }
    .portfolio-preview__section { padding:30px 42px; }
    .portfolio-preview__section-title { font-size:25px; letter-spacing:-.03em; margin:0 0 24px; padding-bottom:10px; position:relative; text-transform:none; }
    .portfolio-preview__section-title::after { background:var(--accent); border-radius:20px; bottom:0; content:""; height:3px; left:0; position:absolute; width:46px; }
    .portfolio-preview__grid { align-items:stretch; display:grid; gap:22px; grid-template-columns:repeat(3,minmax(0,1fr)); }
    .portfolio-preview__card { background:var(--surface); border:1px solid var(--border); border-radius:18px; display:flex; flex-direction:column; min-width:0; overflow:hidden; transition:border-color .45s ease,box-shadow .5s ease,transform .5s cubic-bezier(.2,.75,.25,1); }
    .portfolio-preview__card:hover { border-color:transparent; box-shadow:0 16px 32px rgba(15,32,42,.15),0 0 16px color-mix(in srgb,var(--accent) 20%,transparent); transform:translateY(-4px); }
    .portfolio-preview__media { align-items:center; background:var(--surface-soft); display:flex; height:160px; justify-content:center; overflow:hidden; position:relative; width:100%; }
    .portfolio-preview__image { display:block; height:100%; object-fit:cover; width:100%; }
    .portfolio-preview__placeholder { color:var(--muted); font-size:9px; font-weight:700; letter-spacing:.06em; padding:22px; text-align:center; text-transform:uppercase; }
    .portfolio-preview__overlay { align-items:center; background:color-mix(in srgb,var(--page) 86%,transparent); display:flex; inset:0; justify-content:center; opacity:0; position:absolute; transition:opacity .4s ease; }
    .portfolio-preview__card:hover .portfolio-preview__overlay { opacity:1; }
    .portfolio-preview__actions { align-items:center; display:flex; flex-direction:column; gap:7px; }
    .portfolio-preview__button { background:color-mix(in srgb,var(--accent) 28%,#fff); border:1px solid transparent; border-radius:999px; color:#17313a; display:inline-block; font-size:8px; font-weight:800; letter-spacing:.08em; min-width:120px; padding:8px 12px; text-align:center; text-transform:uppercase; transition:.25s ease; }
    .portfolio-preview__button:hover { background:color-mix(in srgb,var(--accent) 72%,#fff); box-shadow:0 0 12px color-mix(in srgb,var(--accent) 42%,transparent); color:#fff; }
    .portfolio-preview__button--secondary { background:color-mix(in srgb,var(--surface) 82%,transparent); border-color:color-mix(in srgb,var(--accent) 48%,var(--border)); color:var(--text); }
    .portfolio-preview__card-content { display:flex; flex:1; flex-direction:column; padding:20px; }
    .portfolio-preview__card h3 { font-size:17px; line-height:1.25; margin:8px 0 10px; }
    .portfolio-preview__card p { color:var(--muted); font-size:12px; line-height:1.6; margin:0 0 16px; }
    .portfolio-preview__tools { display:flex; flex-wrap:wrap; gap:5px; list-style:none; margin:auto 0 0; padding:0; }
    .portfolio-preview__tools li { background:color-mix(in srgb,var(--accent) 10%,var(--surface)); border:1px solid color-mix(in srgb,var(--accent) 20%,var(--border)); border-radius:999px; color:var(--accent); font-size:8px; padding:4px 7px; white-space:nowrap; }
    .portfolio-preview__simple-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
    .portfolio-preview__simple-card .portfolio-preview__image { height:145px; }
    .portfolio-preview__simple-content { padding:18px; }
    .portfolio-preview__simple-card h3 { font-size:17px; margin:8px 0; }
    .portfolio-preview__simple-card p { color:var(--muted); font-size:12px; line-height:1.55; }
    .portfolio-preview__contact { color:var(--muted); display:grid; font-size:12px; gap:16px; grid-template-columns:repeat(3,1fr); }
    .portfolio-preview__label { color:var(--accent); display:block; font-size:9px; font-weight:800; letter-spacing:.08em; margin-bottom:5px; text-transform:uppercase; }
    @media (max-width:760px) { .portfolio-preview__grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
    @media (max-width:520px) { .portfolio-preview__grid,.portfolio-preview__contact { grid-template-columns:1fr; } .portfolio-preview__section,.portfolio-preview__hero { padding:28px 20px; } }
  `, { raw: true });

  function value(object, key, fallback) {
    return object && object.get ? (object.get(key) || fallback || "") : (fallback || "");
  }

  function listValues(list) {
    return list && list.toArray ? list.toArray() : [];
  }

  var PortfolioPreview = createClass({
    render: function () {
      var data = this.props.entry.get("data");
      var profile = data.get("profile");
      var contact = data.get("contact");
      var site = data.get("site");
      var projects = data.get("projects");
      var samples = data.get("samples");
      var insights = data.get("insights");
      var getAsset = this.props.getAsset;
      var h = window.h;

      function image(path) {
        return path ? h("img", { className:"portfolio-preview__image", src:getAsset(path).toString(), alt:"" }) : null;
      }

      function simpleCards(collection, fallbackLabel) {
        return collection ? collection.map(function (item, index) {
          return h("article", { className:"portfolio-preview__simple-card", key:index }, [
            image(value(item, "cover_image") || value(item, "image")),
            h("div", { className:"portfolio-preview__simple-content" }, [
              h("span", { className:"portfolio-preview__eyebrow" }, value(item, "content_type") || value(item, "eyebrow", fallbackLabel)),
              h("h3", {}, value(item, "title", "Untitled item")),
              h("p", {}, value(item, "summary"))
            ])
          ]);
        }).toArray() : [];
      }

      var projectCards = projects ? projects.map(function (project, index) {
        var projectImage = value(project, "image");
        var caseStudyUrl = value(project, "github_url") || value(project, "case_study_url") || value(project, "url");
        var githubUrl = value(project, "github_url");
        var projectUrl = value(project, "live_url") || value(project, "project_url");
        var tools = listValues(project.get("tools"));
        var actionItems = [];
        if (caseStudyUrl) actionItems.push(h("span", { className:"portfolio-preview__button", key:"case" }, githubUrl ? "View repo" : value(project, "case_study_label", "View documentation")));
        if (projectUrl) actionItems.push(h("span", { className:"portfolio-preview__button portfolio-preview__button--secondary", key:"project" }, value(project, "project_label", "View project")));
        var mediaChildren = [projectImage ? image(projectImage) : h("span", { className:"portfolio-preview__placeholder" }, value(project, "status", "Project documentation in preparation"))];
        if (actionItems.length) mediaChildren.push(h("div", { className:"portfolio-preview__overlay" }, h("div", { className:"portfolio-preview__actions" }, actionItems)));
        return h("article", { className:"portfolio-preview__card", key:index }, [
          h("div", { className:"portfolio-preview__media" }, mediaChildren),
          h("div", { className:"portfolio-preview__card-content" }, [
            h("span", { className:"portfolio-preview__eyebrow" }, value(project, "eyebrow", "Project")),
            h("h3", {}, value(project, "title", "Untitled project")),
            h("p", {}, value(project, "summary")),
            h("ul", { className:"portfolio-preview__tools" }, tools.map(function (tool, toolIndex) { return h("li", { key:toolIndex }, tool); }))
          ])
        ]);
      }).toArray() : [];

      return h("main", { className:"portfolio-preview" + (value(site, "default_theme") === "light" ? " is-light" : "") }, [
        h("header", { className:"portfolio-preview__hero" }, [
          h("span", { className:"portfolio-preview__eyebrow" }, "Portfolio preview"),
          h("h1", {}, value(profile, "name", "Segun Oluyi")),
          h("p", {}, [value(profile, "primary_title") || value(profile, "headline"), " | ", value(profile, "summary")])
        ]),
        h("section", { className:"portfolio-preview__section" }, [h("h2", { className:"portfolio-preview__section-title" }, "Projects"), h("div", { className:"portfolio-preview__grid" }, projectCards)]),
        h("section", { className:"portfolio-preview__section" }, [h("h2", { className:"portfolio-preview__section-title" }, "Work samples"), h("div", { className:"portfolio-preview__grid" }, simpleCards(samples, "Work sample"))]),
        h("section", { className:"portfolio-preview__section" }, [h("h2", { className:"portfolio-preview__section-title" }, "Insights"), h("div", { className:"portfolio-preview__grid" }, simpleCards(insights, "Insight"))]),
        h("footer", { className:"portfolio-preview__section portfolio-preview__contact" }, [
          h("div", {}, [h("span", { className:"portfolio-preview__label" }, "Location"), value(contact, "location")]),
          h("div", {}, [h("span", { className:"portfolio-preview__label" }, "Email"), value(contact, "email")]),
          h("div", {}, [h("span", { className:"portfolio-preview__label" }, "Phone"), value(contact, "phone")])
        ])
      ]);
    }
  });

  CMS.registerPreviewTemplate("portfolio", PortfolioPreview);
}());
