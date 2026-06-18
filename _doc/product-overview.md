# Product Overview

## Working Title
**Cafessistant**

## Summary
A personal coffee shop journey tracker for frequent travelers. The app records every coffee shop visit with ratings and notes, organises the history by city, and delivers smart recommendations — revisit a previously-liked spot or discover a new highly-rated one — whenever the user arrives in a city.

## Problem
Frequent travelers visit dozens of coffee shops across many cities over time. Without a log, it becomes easy to forget which shops they've visited and what they thought of them. The result: they revisit places they didn't enjoy (not realising they'd been before), and miss the chance to return to genuinely loved spots. Each city trip is an uninformed guess.

## Solution
A mobile-first coffee shop journal with an intelligence layer:
1. **Log visits quickly** — shop name, star rating, notes, optional photo; under 30 seconds to capture
2. **City history browser** — all past visits organised by city; surfaces "you've been here before" context at a glance
3. **Smart recommendation engine** — when in a city, suggests (a) the user's own previously-liked spots, and (b) new community-highly-rated options not yet visited

## Target Users
Frequent travelers who care about coffee quality: business travelers, digital nomads, and avid explorers visiting multiple cities per month who want to build a personal, growing atlas of coffee experiences.

## Core Features
- **Visit Logging**: Capture any coffee shop — name, location, 1–5 star rating, tasting notes, optional photo — designed for under-30-second capture
- **City History Browser**: All past visits organised by city; immediate context whenever the user returns to a place
- **Smart Recommendations**: City-aware suggestions drawing on the user's own liked history first, then new highly-rated options not yet tried
- **Travel Memory Layer**: Contextual nudges when revisiting a city or neighbourhood — surfaces relevant past visits and favourites automatically

## Brand & Tone
Personal, warm, travel-forward. Feels like a well-kept journal that happens to be intelligent — not corporate, not overly technical. A trusted companion for coffee-curious travelers.

## Strategic Principles
1. **Memory first** — the core value is recall: knowing what you've experienced before
2. **Intelligence second** — recommendations feel personal, not generic list-based
3. **Speed of capture** — logging a visit must take under 30 seconds or it won't become a habit
4. **Discovery delight** — the emotional payoff is finding a great new shop in an unfamiliar city with confidence

## MVP Scope
- Visit logging (name, location, star rating, tasting notes)
- City-organised visit history browser
- Recommendation engine for a given city (personal history + community ratings)

## Verified Operations (North Star)
Two core domain events this app exists to perform:
- **Visit Logged** — user submits a coffee shop record with a rating
- **Recommendation Requested** — user requests city recommendations from the app

**Projected WVO** (solo frequent traveler, ~1 trip/week):
- 1 trip/week × 3 shops logged + 2 recommendations requested = **5 WVO/week**

**Weekly value estimate:**
- 3 visit logs × $4/log (time saved on future recall + avoided bad revisit) = $12/week
- 2 recommendations × $14/rec (20 min search saved + higher-quality choice) = $28/week
- **Total: ~$40/week → ~$2,080/year**

*(All inputs are user-adjustable assumptions — no hard volume data yet at this stage)*
