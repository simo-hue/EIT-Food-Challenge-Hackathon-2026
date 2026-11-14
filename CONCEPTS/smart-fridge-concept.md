# FridgeMate (working name): make any fridge smart

*EIT Food Hackathon 2026, Budapest. Concept v1.*

## One-liner

An app, plus an optional low-cost camera add-on, that knows what food you have at home, tells you what to cook with it tonight, and helps you pass on what you won't eat, without buying a smart fridge.

## Problem

1. People don't know what they have at home, so they buy duplicates and forget food.
2. They have no idea what to cook with what is there.
3. Smart fridges solve this but are far too expensive, and renters can't take them along.
4. In shared flats nobody knows whose food is whose or what is about to expire.

Result: wasted food and wasted money. Households are the largest single source of food waste in the EU (add the exact Eurostat figure before pitching).

## Target user

**Core: students and young workers in shared flats.**

Persona: Benedek, 25, studies and works. Busy all weekday, eats dinner at home because it is cheaper, hates wasting time, loses interest fast if something is boring. Goals: financial independence, saving money for his passions.

> "I open the fridge at 8 pm, I'm tired, and I don't know what I can make." *(draft quote, replace with a real one from interviews)*

Design consequences: zero manual typing, value shown in money saved, answer in under 10 seconds.

**Later:** people living alone, big families, office kitchens.

## Solution

**Core loop:** capture food → track expiry → suggest tonight's meal → share what's left.

### 1. Capture (multi-input, lowest effort wins)

| Phase | Input | How it works | Hardware |
|---|---|---|---|
| 1 (MVP) | Phone photo while unpacking groceries | Computer vision recognises items | None |
| 1 (MVP) | Receipt photo or barcode scan | Exact product, quantity, price | None |
| 2 | Clip-on fridge camera | Photo at each door opening, updates inventory automatically | Low-cost add-on, portable between fridges |
| 3 | Existing smart fridges | Same software via the fridge's own cameras | Partner hardware |

Expiry dates are estimated from product type and purchase date, and the user can correct them with one tap. Reading printed dates is not required.

### 2. Use

- **Inventory:** live list of what is at home, sorted by "use first".
- **Expiry reminders:** notification before food goes bad.
- **Meal suggestions:** recipes from current ingredients, prioritising items closest to expiry.
- **Shared-flat mode:** shared inventory, items marked private or free for everyone.

### 3. Share surplus (direction proposed, not final)

- **Step 1:** offer food you won't eat to flatmates and neighbours in the app.
- **Step 2:** show nearby community fridges and partner NGOs as drop-off points.

Reason for this order: food banks rarely accept small, opened or near-expiry household items, while peer sharing works from day one.

### 4. Stay engaged

- **Gamification:** money saved and food saved as the main score, streaks for zero-waste weeks, flat-versus-flat leaderboard.
- **Stats:** what was eaten, what was wasted and what it cost.
- **Health (later):** nutritional balance of what you buy and eat, with simple suggestions to improve it.

## Hackathon scope

**Demo:** photo of groceries → inventory with estimated expiry → three dinner suggestions → "offer to flatmates" button → money-saved counter.

**Shown as roadmap only:** fridge camera, health insights, NGO network, smart-fridge integration.

## Stakeholders

| Ring | Who | Role |
|---|---|---|
| Core | Shared flats, students, young workers | Daily users |
| Medium | People living alone, big families, office kitchens | Next user segments |
| Medium | Fridge producers | Licensing and integration partners |
| Medium | Retailers | Digital receipts, product data |
| Macro | Municipalities, health organisations, food NGOs | Waste and health goals, drop-off network |

## Business model

- **Users:** free core app, paid premium (advanced stats, health insights, multiple households), one-off purchase of the camera add-on.
- **Fridge producers:** software licence to bring the same features to their appliances.

## Why it's different

| Alternative | Gap we fill |
|---|---|
| Smart fridges (e.g. Samsung Family Hub) | Expensive, tied to one appliance |
| Pantry apps (e.g. NoWaste, Kitche) | Depend on manual input |
| Surplus apps (e.g. Too Good To Go, Olio) | Don't know what is in your own fridge |

Our position: automatic capture, works on any fridge, moves with you, and connects inventory to cooking and sharing in one loop.

## Risks and open questions

- **Recognition accuracy:** leftovers, opaque containers and hidden items. Mitigation: combine photo with receipt data, allow one-tap correction.
- **Fridge camera:** power, Wi-Fi inside the fridge, cold, unit cost. Needs a prototype before any price promise.
- **Retention:** the user must get value with almost no effort, otherwise the inventory goes stale.
- **Food safety and liability** when sharing food between people.
- **Willingness to pay** among students. Needs testing.
- **To decide:** final surplus partner model, product name, premium price, camera price target.
