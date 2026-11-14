# Doorman — Business Model (EIT Food Challenge Labs Hungary 2026)

> Working name: **Doorman** (name + slogan to be refined later)
> Draft tagline: *"Your old fridge finally knows who's coming and going."*
> Team: 3 members (names/roles TBD)

---

## 1. Problem

- EU households throw away **69 kg of food per person per year** (2024) — 53% of all EU food waste. In Hungary: **62 kg per person** (2023).
- Household food waste costs **€357–405 per household per year** and causes **~149 kg CO₂e per household per year**.
- Food waste = **~16% of EU food-system GHG emissions**.
- Smart fridges that track food cost thousands of euros; >95% of EU households own a (mostly "dumb") fridge.

### Pains
1. Not sure what products you have
2. No idea what to cook
3. Smart fridges are really expensive
4. Food and money wasted (forgotten items expire)
5. Shared flat / office: whose food is whose, who took it

---

## 2. Solution

A small clip-on camera that turns **any old fridge** into a smart one.

- Wakes when the door opens (**light sensor + IMU**), watches the door opening and logs every item going **IN** and **OUT**.
- Inventory = in − out → items hidden at the back are never "lost".
- Unclear / covered items → **"Unknown – please verify"**, user confirms or edits in the app.
- **Edge AI (ESP32-S3)** classifies on-device; only structured data (item, in/out, time, confidence) goes to the cloud — **no video leaves the fridge**.
- Rechargeable battery.

### Two versions
- **Hardware + software** for any fridge
- **Software only** for fridges that are already smart

### Features
1. Track foods you have (fridge first)
2. Expiry reminders
3. Meal suggestions from what you have
4. Portable — move it to a new fridge
5. Waste-reduction tips
6. Stats on food data (waste, habits)
7. Nutrition meter per item (health)
8. Name tags for shared fridges (office / shared flat): "this is mine"

---

## 3. USP & Competitors

| Player | Type | Tracks in/out? | Price | Status |
|---|---|---|---|---|
| Smarter FridgeCam → FoodCam 2 (UK) | Retrofit | No — snapshot after door closes | ~£149 (original) | On market (FoodCam 2); weak recognition in reviews |
| FoodSpai | Retrofit | No — snapshot | €139 device / €179 with 1-yr app | On market, traction unknown |
| Fridge Eye (brezzl, DE) | Retrofit | No — photo only | — | Unclear |
| Samsung Family Hub (AI Vision Inside) | Built-in smart fridge | **Yes** | from ~$3–5k | On market; can't see door bins |
| Manual apps (NoWaste, FridgeBuddy, FoodWise…) | App only | Manual entry | Free / freemium | On market |
| **Doorman** | **Retrofit** | **Yes** | **~€49 + €5/month** | Concept |

**USP:** Samsung-level in/out tracking, as a cheap retrofit for any fridge, with on-device AI and no video upload.

---

## 4. Target Market

- **Small households without smart fridges** (B2C)
- Students, shared flats, families
- **Office fridges** (shared, name your food so no one steals it)
- Out of scope: grocery shops, restaurants, retail

### Personas
1. Busy students / workers
2. Families
3. People in shared flats

### Users inside a household
Shopper · cook · flatmates / family / colleagues

### TAM / SAM / SOM (assumptions marked)
| | Definition | Size | Value (€60/yr subscription) |
|---|---|---|---|
| **TAM** | EU households (202 M in 2024, >95% own a fridge, mostly non-smart) | ~190 M households | ~€11 bn / yr |
| **SAM** | Hungary households (*est.* ~4.1 M) | ~4.1 M | ~€250 M / yr |
| **SOM** | 0.5% of Hungary in 3 years (*assumption*) | ~20,000 households | ~€1.2 M / yr + device sales |

---

## 5. Business Model Canvas

| Block | Content |
|---|---|
| **Customer segments** | Small households without smart fridges, students, shared flats, office fridges |
| **Value proposition** | Know what's in your fridge, waste less, save money, eat healthier — on any fridge, at a fraction of a smart fridge's price |
| **Channels** | Own online shop, Amazon, social media |
| **Customer relationships** | Customer support, in-app onboarding, user edits improve the AI |
| **Revenue streams** | Cheap hardware (~€49) + **main income: subscription ~€5/month** |
| **Key resources** | AI model, ESP32-S3 + camera hardware, food image dataset, team of 3 |
| **Key activities** | (skipped) |
| **Key partners / stakeholders** | Fridge producers (collaboration), hardware suppliers, cloud provider, EIT Food / investors, municipalities / EU |
| **Cost structure** | Hardware (target < $100, estimate ~$35), cloud, app & AI development, marketing |

---

## 6. Finance

### Unit economics (estimates)
| Item | Value |
|---|---|
| Hardware cost (BOM) | ~$35 (camera + ESP32-S3 ~$10, sensors ~$3, battery + charging ~$5, housing ~$5, PCB/assembly ~$8, packaging ~$3) |
| Device price | ~€49 (near cost — gets users in) |
| Subscription | €5 / month = €60 / year |
| Cloud cost per user (*assumption*) | ~€0.50 / month (structured data only, no video) |
| Subscription gross margin | ~90% |
| Customer saves | ~€180–200 / year (50% of €357–405) → **3× the subscription price** |

### Break-even (*assumption*)
- Year-1 fixed costs ~€150k (team, prototyping, certification, marketing)
- Margin ≈ €4.50 / subscriber / month → **~2,800 paying subscribers** to break even.

### Funding
- **EU grants** (e.g. EIT Food Seedbed subgrants, Seedbed alumni funding up to €50k)
- **Angel investors**
- **Winning EIT Food Challenge Labs** 😄

---

## 7. Porter's Five Forces

| Force | Level | Why |
|---|---|---|
| Competitive rivalry | Low–medium | Few retrofit players (Smarter, FoodSpai); none track in/out |
| Threat of new entrants | High | Cheap hardware, AI APIs; hobby projects already exist |
| Threat of substitutes | **High** | Free manual apps; photo-scan apps; smart fridges for richer buyers |
| Buyer power | High | Price-sensitive households, free alternatives |
| Supplier power | Low | ESP32, cameras, sensors are commodity parts |

**Defence:** in/out tracking model + growing food dataset (user edits = labels) + speed to market.

---

## 8. STEEPLE

| Factor | Points |
|---|---|
| **Social** | Single-person households growing fast (+16.9% in EU 2015–2024); busy lifestyles; shared flats; cost-of-living pressure |
| **Technological** | Cheap edge AI (ESP32-S3), mature computer vision; smart-home adoption rising |
| **Economic** | Households lose €357–405/yr to food waste; smart fridges too expensive for most |
| **Environmental** | Food waste ≈ 16% of EU food-system GHG; ~149 kg CO₂e per household per year |
| **Political** | Revised EU Waste Framework Directive (in force 16 Oct 2025): binding **−30% per capita** food waste in retail, food services and households by 2030 → governments/municipalities need household solutions |
| **Legal** | GDPR (camera in the home); EU Cyber Resilience Act covers connected home cameras and fridges; CE / radio equipment rules |
| **Ethical** | Camera privacy (solved: on-device AI, no video upload); office use must not become colleague surveillance — only item-level, opt-in name tags |

---

## 9. SWOT

| Strengths | Weaknesses |
|---|---|
| In/out tracking (unique in retrofit) | Recognition accuracy not yet proven |
| Cheap, works on any fridge, portable | Battery life with video bursts |
| Privacy by design (edge AI) | Small team, no brand yet |
| Clear money saving > subscription price | Door bins / occlusion by hands |

| Opportunities | Threats |
|---|---|
| Binding EU 2030 food-waste targets | Smarter / FoodSpai copy in/out tracking |
| Fridge-maker collaboration (software version) | Free manual apps are "good enough" for some |
| Office / shared-flat niche | Users cancel subscription after novelty |
| EIT Food / EU funding | Privacy fears about cameras at home |

---

## 10. Sustainability (3 pillars)

### Environmental
- Claim: **up to 50% less household food waste** (to be validated in pilot).
- = ~**75 kg CO₂e saved per household per year** (50% of 149 kg).
- Rechargeable battery; edge processing (no video streaming).
- Supports **SDG 12.3** (halve per capita food waste by 2030) and the EU's binding −30% target.

### Social
- **Food security:** less waste while 42 M+ EU people can't afford a quality meal every second day.
- **Health:** nutrition meter per item, healthier meal suggestions.
- **Fairness in shared fridges** (flats, offices).

### Economic
- **~€180–200 saved per household per year** vs €60 subscription.
- Affordable alternative to a €3–5k smart fridge.

---

## 11. Roadmap (draft)

| When | Milestone |
|---|---|
| Q1 2027 | Working prototype (ESP32-S3 + camera + app) |
| Q2 2027 | Pilot: ~30 households / shared flats / 1 office in Budapest — measure waste before/after (validate 50% claim) |
| Q4 2027 | Launch in Hungary: online shop, Amazon, social media |
| 2028 | CEE expansion; office version; fridge-maker software partnership |

---

## 12. Open items
- [ ] Final **name + slogan** (Doorman is a candidate; check trademark)
- [ ] Team slide: names + roles
- [ ] Validate hardware cost with real parts list
- [ ] Pilot design to prove the 50% claim

---

## Sources
- Eurostat — Food waste and food waste prevention, estimates (2024 data): https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/110448.pdf
- Trade Magazin — Hungary 2023 food waste: https://trademagazin.hu/en/eurostat-az-eu-ban-lakosonkent-kozel-130-kilogramm-elelmiszer-veszett-karba-2023-ban
- Luke (Natural Resources Institute Finland) — household food waste cost & CO₂e per household: https://jukuri.luke.fi/server/api/core/bitstreams/1595a40b-8f9c-48ba-b1cf-bef68ee7cd6c/content
- European Commission — Food waste FAQ (16% of food-system GHG, SDG 12.3): https://food.ec.europa.eu/food-safety/food-waste/frequently-asked-questions-reducing-food-waste-eu_en
- European Commission — Revised Waste Framework Directive enters into force: https://environment.ec.europa.eu/news/revised-waste-framework-directive-enters-force-2025-10-16_de
- Friends of Europe — 2030 binding targets: https://www.friendsofeurope.org/insights/critical-thinking-europe-steps-up-the-fight-against-food-waste/
- Eurostat — Household composition statistics (202 M households, single-person growth): https://ec.europa.eu/eurostat/statistics-explained/index.php/Household_composition_statistics
- Market Data Forecast — Europe household appliances (>95% own a fridge): https://www.marketdataforecast.com/market-reports/europe-household-appliances-market
- Hunton — Cyber Resilience Act: https://www.hunton.com/privacy-and-cybersecurity-law-blog/council-of-the-european-union-adopts-the-cyber-resilience-act
- EIT — Seedbed alumni investment: https://eit.europa.eu/our-activities/opportunities/seedbed-alumni-investment-2025
- EIT Food — Seedbed 2026–2028 call: https://assets.eitfood.eu/files/Seedbed/Seedbed-2026-2028-Call-Venture-Builders-2.0-1.pdf
- Smarter FoodCam 2: https://smarter.am/products/foodcam-2
- FoodSpai pricing: https://www.foodspai.com/pricing-plans/list
- Samsung Family Hub 2025 update: https://news.samsung.com/us/samsung-family-hub-2025-update-elevates-smart-home-ecosystem
- NoWaste app: https://the-gr0ve.pages.dev/kits/everyday-green-transition/food-and-garden/nowaste-app/
