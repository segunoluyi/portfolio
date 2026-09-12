(function () {
  "use strict";

  CMS.registerPreviewStyle(`
    * { box-sizing: border-box; }
    body { margin: 0; background: #f1f4f7; color: #1f2933; font-family: Arial, sans-serif; }
    .portfolio-preview { max-width: 980px; margin: 0 auto; background: #fff; min-height: 100vh; }
    .portfolio-preview__hero { background: linear-gradient(135deg, #101820, #233344); color: #fff; padding: 48px 36px; text-align: center; }
    .portfolio-preview__eyebrow { color: #afc7dc; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .portfolio-preview h1 { margin: 12px 0; font-size: 38px; line-height: 1.1; }
    .portfolio-preview__hero p { max-width: 680px; margin: 0 auto 20px; color: #e5edf5; line-height: 1.6; }
    .portfolio-preview__button { display: inline-block; border: 1px solid currentColor; color: inherit; padding: 10px 17px; text-decoration: none; font-size: 13px; font-weight: 700; }
    .portfolio-preview__section { padding: 32px 36px; }
    .portfolio-preview__section-title { margin: 0 0 20px; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; }
    .portfolio-preview__feature { border: 1px solid #d9e0e6; }
    .portfolio-preview__image { width: 100%; height: 220px; object-fit: cover; background: #e8edf1; display: block; }
    .portfolio-preview__content { padding: 24px; }
    .portfolio-preview h2 { margin: 0 0 12px; font-size: 24px; }
    .portfolio-preview p { line-height: 1.55; }
    .portfolio-preview__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .portfolio-preview__card { border: 1px solid #d9e0e6; }
    .portfolio-preview__card .portfolio-preview__image { height: 145px; }
    .portfolio-preview__card-content { padding: 18px; }
    .portfolio-preview__card h3 { margin: 8px 0 10px; font-size: 19px; }
    .portfolio-preview__card p { font-size: 14px; }
    .portfolio-preview__contact { background: #f4f7f9; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 13px; }
    .portfolio-preview__label { display: block; color: #667684; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 5px; }
    @media (max-width: 620px) { .portfolio-preview__grid, .portfolio-preview__contact { grid-template-columns: 1fr; } .portfolio-preview__section, .portfolio-preview__hero { padding: 28px 22px; } }
  `, { raw: true });

  function value(object, key, fallback) {
    return object && object.get ? (object.get(key) || fallback || "") : (fallback || "");
  }

  var PortfolioPreview = createClass({
    render: function () {
      var data = this.props.entry.get("data");
      var profile = data.get("profile");
      var featured = data.get("featured_project");
      var contact = data.get("contact");
      var projects = data.get("projects");
      var getAsset = this.props.getAsset;
      var h = window.h;

      function image(path, className) {
        return path ? h("img", { className: className, src: getAsset(path).toString(), alt: "" }) : null;
      }

      var cards = projects ? projects.map(function (project, index) {
        var projectImage = value(project, "image");
        return h("article", { className: "portfolio-preview__card", key: index }, [
          image(projectImage, "portfolio-preview__image"),
          h("div", { className: "portfolio-preview__card-content" }, [
            h("span", { className: "portfolio-preview__eyebrow" }, value(project, "eyebrow", "Project")),
            h("h3", {}, value(project, "title", "Untitled project")),
            h("p", {}, value(project, "summary")),
            h("span", { className: "portfolio-preview__button" }, value(project, "button_label", "View project"))
          ])
        ]);
      }).toArray() : [];

      return h("main", { className: "portfolio-preview" }, [
        h("header", { className: "portfolio-preview__hero" }, [
          h("span", { className: "portfolio-preview__eyebrow" }, "Portfolio preview"),
          h("h1", {}, value(profile, "name", "Segun Oluyi")),
          h("p", {}, [value(profile, "headline"), " ", value(profile, "summary")]),
          h("span", { className: "portfolio-preview__button" }, value(profile, "linkedin_label", "LinkedIn"))
        ]),
        h("section", { className: "portfolio-preview__section" }, [
          h("h2", { className: "portfolio-preview__section-title" }, "Featured project"),
          h("article", { className: "portfolio-preview__feature" }, [
            image(value(featured, "image"), "portfolio-preview__image"),
            h("div", { className: "portfolio-preview__content" }, [
              h("h2", {}, value(featured, "title", "Featured project")),
              h("p", {}, value(featured, "summary")),
              h("span", { className: "portfolio-preview__button" }, value(featured, "button_label", "View project"))
            ])
          ])
        ]),
        h("section", { className: "portfolio-preview__section" }, [
          h("h2", { className: "portfolio-preview__section-title" }, "Project cards"),
          h("div", { className: "portfolio-preview__grid" }, cards)
        ]),
        h("footer", { className: "portfolio-preview__section portfolio-preview__contact" }, [
          h("div", {}, [h("span", { className: "portfolio-preview__label" }, "Location"), value(contact, "location")]),
          h("div", {}, [h("span", { className: "portfolio-preview__label" }, "Email"), value(contact, "email")]),
          h("div", {}, [h("span", { className: "portfolio-preview__label" }, "Phone"), value(contact, "phone")])
        ])
      ]);
    }
  });

  CMS.registerPreviewTemplate("portfolio", PortfolioPreview);
}());
