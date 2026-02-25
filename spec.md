# Specification

## Summary
**Goal:** Add an owner admin panel, LNT rebranding, auto-refreshing public catalog, and a navigation bar to the MakeItHappen.com music portfolio app.

**Planned changes:**
- Add an `/admin` route with an admin panel page gated behind Internet Identity authentication
- Admin panel includes a form to add new music entries (title, artist, album, cover image URL, release year, genre, streaming platform links) and a delete button for each existing entry
- Rebrand the entire app with "LNT" and "MakeItHappen.com" — update browser tab title, hero banner, header, footer, and remove all generic placeholder copy
- Preserve the existing dark, bold, music-inspired visual theme with LNT branding applied consistently
- Add a navigation bar at the top of every page showing the LNT brand name, a public catalog link, an "Admin" link (authenticated only), and a login/logout button
- Implement polling (every 10–15 seconds) on the public catalog page so new entries appear automatically without a full page reload

**User-visible outcome:** Visitors see a rebranded LNT / MakeItHappen.com site with a nav bar and a live-updating music catalog; the authenticated owner can navigate to `/admin` to add or remove music entries, and changes appear on the public page automatically.
