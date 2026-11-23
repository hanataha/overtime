# overtime

2026年の残業報告サイトです。An overtime report for 2026.

Live page: https://hanataha.github.io/overtime/

## What it shows

- Official overtime days for October and November 2026
- Calculated hours next to any hours that were written down
- Month totals, a day-by-day breakdown, the rules, and how to export Google Maps Timeline as proof

The language toggle (日本語 / English) defaults to Japanese.

## Files

- `data.js` — official days and work-time rules. Edit this file to change the base records.
- `index.html`, `styles.css`, `app.js` — the site itself.

Days added in the browser are saved only on that device (`localStorage`). They are not written into `data.js`.
