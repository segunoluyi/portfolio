import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const contentPath = resolve(root, "content", "portfolio.json");
const samplesRoot = resolve(root, "samples");
const content = JSON.parse(await readFile(contentPath, "utf8"));
const samples = Array.isArray(content.samples) ? content.samples : [];
const seen = new Set();

function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
  });
}

function createPage(sample) {
  const title = escapeHtml(sample.title || "Work sample");
  const type = escapeHtml(sample.content_type || "Work sample");
  const industry = escapeHtml(sample.industry || "");
  const summary = escapeHtml(sample.summary || "");
  const detailSummary = escapeHtml(sample.detail_summary || sample.summary || "");
  const slug = escapeHtml(sample.slug);
  const canonical = "https://segunoluyi.github.io/portfolio/samples/" + slug + "/";

  return [
    "<!DOCTYPE HTML>",
    "<html lang=\"en\">",
    "  <head>",
    "    <title>" + title + " | Segun Oluyi</title>",
    "    <meta charset=\"utf-8\" />",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, user-scalable=no\" />",
    "    <meta name=\"description\" content=\"" + detailSummary + "\" />",
    "    <meta property=\"og:title\" content=\"" + title + " | Segun Oluyi\" />",
    "    <meta property=\"og:description\" content=\"" + detailSummary + "\" />",
    "    <meta property=\"og:type\" content=\"article\" />",
    "    <meta property=\"og:url\" content=\"" + canonical + "\" />",
    "    <link rel=\"canonical\" href=\"" + canonical + "\" />",
    "    <link rel=\"icon\" href=\"../../assets/favicon.svg\" type=\"image/svg+xml\" />",
    "    <link rel=\"stylesheet\" href=\"../../assets/css/main.css\" />",
    "    <noscript><link rel=\"stylesheet\" href=\"../../assets/css/noscript.css\" /></noscript>",
    "  </head>",
    "  <body class=\"is-preload\" data-sample-slug=\"" + slug + "\">",
    "    <div id=\"wrapper\">",
    "      <nav id=\"nav\" class=\"top-navigation\">",
    "        <ul class=\"links\">",
    "          <li><a href=\"../../\">Home</a></li>",
    "          <li><a href=\"../../index.html#about\">About</a></li>",
    "          <li><a href=\"../../projects/\">Projects</a></li>",
    "          <li class=\"active\"><a href=\"../\">Samples</a></li>",
    "          <li><a href=\"../../insights/\">Insights</a></li>",
    "          <li><a href=\"../../index.html#skills\">Skills</a></li>",
    "          <li><a href=\"../../index.html#footer\">Contact</a></li>",
    "        </ul>",
    "        <ul class=\"icons\">",
    "          <li><a href=\"https://oluyisegun.medium.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"icon brands alt fa-medium\"><span class=\"label\">Medium</span></a></li>",
    "          <li><a href=\"https://www.linkedin.com/in/segun-oluyi\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"icon brands alt fa-linkedin-in\"><span class=\"label\">LinkedIn</span></a></li>",
    "          <li><a href=\"https://github.com/segunoluyi\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"icon brands alt fa-github\"><span class=\"label\">GitHub</span></a></li>",
    "        </ul>",
    "      </nav>",
    "      <div id=\"main\">",
    "        <section class=\"post sample-detail\">",
    "          <div class=\"sample-detail-layout\">",
    "            <div class=\"sample-detail-media\">",
    "              <img class=\"sample-detail-cover-image\" data-sample-cover-image alt=\"\" hidden />",
    "              <div class=\"sample-cover sample-detail-cover\" data-sample-cover-fallback>",
    "                <span data-sample-cover-type>" + type + "</span>",
    "                <strong data-sample-cover-title>" + title + "</strong>",
    "              </div>",
    "            </div>",
    "            <div class=\"sample-detail-content\">",
    "              <header class=\"major sample-detail-header\">",
    "                <span class=\"date\" data-sample-type>" + type + "</span>",
    "                <h1 data-sample-title>" + title + "</h1>",
    "                <p data-sample-summary>" + detailSummary + "</p>",
    "              </header>",
    "              <dl class=\"sample-facts\">",
    "                <div><dt>Document type</dt><dd data-sample-type>" + type + "</dd></div>",
    "                <div><dt>Industry</dt><dd data-sample-industry>" + industry + "</dd></div>",
    "              </dl>",
    "              <section class=\"sample-deliverables\" data-sample-deliverables-section hidden>",
    "                <h3>What this work covers</h3>",
    "                <p data-sample-demonstrates></p>",
    "                <ul data-sample-deliverables></ul>",
    "              </section>",
    "              <div class=\"box sample-disclosure\">",
    "                <h3>Portfolio disclosure</h3>",
    "                <p data-sample-message>This page describes a confidentiality-safe portfolio sample. The underlying document remains hosted at its approved public destination.</p>",
    "              </div>",
    "              <ul class=\"actions special sample-detail-actions\">",
    "                <li><a class=\"button primary\" data-sample-document-link href=\"#\">View document</a></li>",
    "                <li data-sample-case-study-action hidden><a class=\"button\" data-sample-case-study-link href=\"#\">Read full case study</a></li>",
    "                <li><a class=\"button\" href=\"../\">Back to work samples</a></li>",
    "              </ul>",
    "            </div>",
    "          </div>",
    "        </section>",
    "      </div>",
    "      <footer id=\"footer\"><section class=\"split contact\"><section><h3>Location</h3><p>Ikeja, Lagos, Nigeria</p></section><section><h3>Email</h3><p><a href=\"mailto:oluyisegun@gmail.com\">oluyisegun@gmail.com</a></p></section><section><h3>Social</h3><ul class=\"icons alt\"><li><a href=\"https://www.linkedin.com/in/segun-oluyi\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"icon brands alt fa-linkedin-in\"><span class=\"label\">LinkedIn</span></a></li><li><a href=\"https://github.com/segunoluyi\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"icon brands alt fa-github\"><span class=\"label\">GitHub</span></a></li></ul></section></section></footer>",
    "      <div id=\"copyright\"><ul><li>&copy; 2026</li><li>Design: <a href=\"https://www.linkedin.com/in/segun-oluyi\">Segun Oluyi</a></li></ul></div>",
    "    </div>",
    "    <script src=\"../../assets/js/jquery.min.js\"></script>",
    "    <script src=\"../../assets/js/jquery.scrollex.min.js\"></script>",
    "    <script src=\"../../assets/js/jquery.scrolly.min.js\"></script>",
    "    <script src=\"../../assets/js/browser.min.js\"></script>",
    "    <script src=\"../../assets/js/breakpoints.min.js\"></script>",
    "    <script src=\"../../assets/js/util.js\"></script>",
    "    <script src=\"../../assets/js/main.js\"></script>",
    "    <script src=\"../../assets/js/sample-detail.js\"></script>",
    "  </body>",
    "</html>",
    ""
  ].join("\n");
}

for (const sample of samples) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sample.slug || "")) {
    throw new Error("Each sample needs a lowercase hyphenated slug. Invalid slug for: " + (sample.title || "Untitled sample"));
  }
  if (seen.has(sample.slug)) throw new Error("Duplicate sample slug: " + sample.slug);
  seen.add(sample.slug);
  const directory = resolve(samplesRoot, sample.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), createPage(sample));
}

console.log("Generated " + samples.length + " sample detail pages.");
