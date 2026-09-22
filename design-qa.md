# Design QA — Work sample detail page

**Source visual truth**

- Reference layout: `C:/Users/ECR-TS/AppData/Local/Temp/codex-clipboard-e3a24fbc-f4d2-4f7d-88db-6eaedafb1b25.png` (the user-provided Codar course-detail reference).
- Implementation: browser-rendered `http://127.0.0.1:4173/samples/abc-fishing-company/`, captured in the Codex in-app browser during this QA run.
- Viewport: 1280 × 720 CSS pixels at the browser default density. The source screenshot includes browser chrome and a wider desktop canvas, so comparison was made on the page-content region rather than the outer browser frame.
- State: ABC Fishing Company sample, Overview selected, cover image loaded, action links present.

**Full-view comparison evidence**

The reference uses a wide content column for the course narrative and a clearly separate right-side card for media and actions. The implementation now uses the same information architecture: a page title, one Overview tab, an “About this sample” narrative, a bullet-only “What this work covers” section, and a bounded sidebar card for the cover, categories, and actions. It intentionally preserves the portfolio’s existing typography, navigation, and monochrome visual system rather than copying Codar’s branding, video player, price, or course-enrolment controls.

**Focused region comparison evidence**

The relevant region was the primary content area. The browser capture confirmed that the right card has no blue background, the cover is contained inside the card, and the document type, industry, View document, and Back to work samples controls appear together below it. No additional focused region was needed because no icons, custom controls, or dense data display were introduced.

**Required fidelity surfaces**

- **Fonts and typography:** The existing portfolio display and body fonts are retained. The hierarchy makes the sample title, Overview tab, section headings, narrative, and bullet list distinct without compressing the copy.
- **Spacing and layout rhythm:** Desktop uses a wider reading column and a narrower right-side card with a 4rem gap. The card collapses below the overview on small screens.
- **Colors and visual tokens:** The blue content panel was removed. The page uses white surfaces, neutral borders, and the existing dark primary action style.
- **Image quality and asset fidelity:** The approved cover is shown as the actual uploaded image with `object-fit: contain`; it is not cropped, stretched, or recreated.
- **Copy and content:** “About this sample” maps to `detail_summary`. “What this work covers” maps only to `key_deliverables`, so no repeated explanatory paragraph appears before the bullets.

**Findings**

No actionable P0, P1, or P2 differences remain for the agreed adaptation. The absent Curriculum and FAQ tabs are intentional: the user requested one focused tab for these document samples.

**Open Questions**

None for this layout. Every public document remains in the Work Samples library; no separate sample case-study route is used.

**Implementation Checklist**

- [x] Replace the poster-style document layout with the Overview and sidebar-card structure.
- [x] Move the cover, document type, industry, and actions into the sidebar card.
- [x] Remove the duplicated capability paragraph from the page and CMS schema.
- [x] Regenerate every sample page from the shared generator.
- [x] Verify all seven generated routes return HTTP 200 and the ABC page has no browser-console errors.

**Follow-up Polish**

- [P3] Consider adding a custom cover image for any future sample whose document cover is not suitable as a small card preview.

**Comparison history**

1. The prior poster-style implementation had a blue content panel and mixed the image with the text. It was replaced with the current overview-and-card design.
2. The revised browser-rendered page was checked at 1280 × 720 with the ABC Fishing Company content and no remaining P0–P2 issues.

final result: passed
