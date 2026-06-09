# Peel Park Diaries

A showcase of what machine transcription and analysis can do with **Salford's
Parks Report Books** — the working records of the gardeners and Parks
Superintendents who ran Peel Park and Salford's other public parks. Peel Park
opened in 1846 as one of the first publicly funded parks in the world, which
makes its surviving operational records an unusually long and rich source for
the day-to-day history of public green space in Britain.

This repository holds the scanned page images **and** a small static website
that demonstrates four capabilities on a curated set of pages: transcription,
full-text search, people/place extraction, and thematic analysis.

## The showcase website

Built as a dependency-free static site in [`docs/`](docs/), ready for GitHub
Pages. It demonstrates, on a curated set of transcribed pages spanning **1905–1946**:

- **Page viewer + transcription** — each scanned page beside its machine-read text.
- **Full-text search** — search every transcribed page and jump to matches.
- **People & places** — names and parks pulled out and linked back to the pages.
- **Themes** — short threads (staffing, sport, wartime, money, land, and insects/invertebrates) built from quotes.

> **Transcriptions are first-pass, AI-generated drafts** shown to illustrate the
> method. Uncertain readings are marked `[?]`; figure-tables are summarised. They
> have not been checked against the originals and should not be cited as
> definitive.

### Run it locally

```powershell
cd docs
python -m http.server 8000   # then open http://localhost:8000
```

(Any static server works; opening `docs/index.html` directly also works because
the data is loaded as plain JavaScript, not via `fetch`.)

### Publish on GitHub Pages (visioninglab)

1. Create a repository under the **visioninglab** account and push this folder.
2. In **Settings → Pages**, set **Source: Deploy from a branch**, branch `main`,
   folder **`/docs`**.
3. The site will appear at `https://visioninglab.github.io/<repo-name>/`.

Only the curated images live in [`docs/images/`](docs/images/), so the
published site stays lean and republishes a small, captioned subset rather than
the full set of raw scans.

## Source material

Three bound volumes have been digitised, one page per image:

| Archive reference | Folder | Pages | Form | Span (observed) |
|---|---|---|---|---|
| L/CS/DR4/5 | [`L-CS-DR4-5/`](L-CS-DR4-5/) | 215 | Handwritten (+ printed inserts) | c. 1905–1912 |
| L/CS/DR4/8 | [`L-CS-DR4-8/`](L-CS-DR4-8/) | 199 | Handwritten | c. 1922–1926 |
| L/CS/DR4/16 | [`L-CS-DR4-16/L-CS-DR4-16/`](L-CS-DR4-16/L-CS-DR4-16/) | 319 | Typescript | c. 1942–1946 |

All three are periodic reports from the Parks Superintendent to Salford's Parks
Committee, recording staffing (gardeners, foremen, propagators), retirements and
superannuation, receipts (bowling greens, tennis courts, even tomatoes and
pigeons), planting and grounds work, land acquisition, the seasonal fight against
worms in the bowling greens, and — in the 1940s volume — wartime and post-war
administration. DR4/5 also has printed inserts: band programmes for music in the
parks and Peel Park flower-show schedules.

These volumes are part of the **Salford Parks Report Books (1874–1967)**, written
by successive Head Gardeners and Park Superintendents. The handwritten volumes
run to 1933; later volumes are typescript — consistent with the three scanned here.
(DR4/5 was supplied as a single PDF; its 215 pages were extracted to JPEGs to
match the other volumes.)

## Repository structure

```
peelparkdiaries/
├── README.md
├── docs/                       # the showcase website (GitHub Pages root)
│   ├── index.html
│   ├── .nojekyll
│   ├── assets/  (style.css, app.js, data.js — transcriptions + entities + themes)
│   └── images/  (the curated, captioned scans)
├── L-CS-DR4-5/                 # 001.jpg … 215.jpg  (handwritten, c.1905–1912)
├── L-CS-DR4-8/                 # 001.jpg … 199.jpg  (handwritten, c.1922–1926)
└── L-CS-DR4-16/
    └── L-CS-DR4-16/            # 001.jpg … 319.jpg  (typescript, c.1942–1946)
```

The source volumes are nested differently (`L-CS-DR4-5/` and `L-CS-DR4-8/` are
flat; `L-CS-DR4-16/` has an extra subfolder). Image numbers are the **scan sequence**,
not the original page/folio numbers written in the volumes — transcriptions
record both where they differ.

## Provenance & rights

- **Collection:** Salford Parks Report Books (1874–1967)
- **Held by:** University of Salford Archives & Special Collections
- **Reproduced with permission from:** Salford Community Leisure

Confirm reuse terms with the holding institution and Salford Community Leisure
before publishing the page images publicly. Treat the full set of scans as
research-use material until that is settled.

## Status

Demonstration / proof of concept. The page images are in place and a curated
sample is transcribed and presented. A fuller transcription, indexing, and
analysis of both volumes is the work ahead.
