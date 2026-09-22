# Portfolio site architecture

This site separates **where visitors browse**, **where content is managed**, and **where source files are stored**.

## Public routes

| Route | Purpose | What belongs there |
| --- | --- | --- |
| `/` | Professional overview | Introduction, selected projects, three sample previews, insights, skills, contact details |
| `/samples/` | Scalable business-plan library | All cleared, public samples; filter by industry; each card opens its document in Google Drive |
| `/case-studies/<slug>.html` | Flagship work only | Context, approach, selected evidence, outcome and links for a piece worth a fuller story |
| `/admin/` | Private content management | Decap CMS editor, protected by GitHub sign-in |

The primary navigation is deliberately consistent everywhere:

**Home · About · Projects · Samples · Insights · Skills · Contact**

On the homepage, **Samples** always goes to `/samples/`. The sample preview is a curated section on the homepage, and **View all samples** also goes to `/samples/`.

## Content rules

- Add a document-led, confidentiality-cleared example to the **Samples library** first.
- Keep every public work sample in the **Samples library**. Do not create a separate case-study page for a sample.
- Keep raw and client-sensitive files outside the public repository. Only public-safe PDFs and their approved Drive links belong in the Samples library.
- The homepage displays three sample previews; the library handles the full collection and paginates automatically after twelve cards.

## Management and publishing flow

1. Store and verify the approved source file in Google Drive.
2. Set that exact public-safe copy to **Anyone with the link — Viewer**.
3. Add the sample in the CMS under **Samples library** and publish.
4. Confirm the card and its Drive link on `/samples/`.
5. Update the Notion tracker: retain the work `Status`, then mark `Website Status` as Published only after the card is live.

## Design changes later

The visual design can change without changing the information architecture. Keep the public routes, the CMS schema in `admin/config.yml`, and content stored in `content/portfolio.json`; update the HTML and CSS presentation around them.
