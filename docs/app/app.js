// FridgeMate demo app — scripted, offline, no backend. All data is simulated.
import {
  SEED_VERSION, ME, MEMBERS, FLAT_NAME, FOODS, SEED_ITEMS, SEED_FEED,
  CAMERA_EVENTS, RECIPES, SEED_STATS, CO2_PER_KG, BADGES, LEADERBOARD,
} from "./data.js";
import { icon } from "./icons.js";

const KEY = "fridgemate-demo";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- state ---------- */

function seed() {
  return {
    v: SEED_VERSION,
    items: SEED_ITEMS.map((it, i) => ({ id: "s" + i, ...it })),
    feed: SEED_FEED.map((f) => ({ ...f })),
    stats: { ...SEED_STATS },
    cam: 0,
    seq: 0,
    seenNotifs: false,
    statsDot: false,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.v === SEED_VERSION && Array.isArray(s.items)) return s;
    }
  } catch (e) { /* private mode or bad data: fall back to seed */ }
  return seed();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* keep going in memory */ }
}

let state = load();
let view = "fridge";
let sharedFilter = "all";
let shown = { money: 0, kg: 0, co2: 0 }; // last numbers drawn on Stats, for count-ups
let flashId = null;

/* ---------- helpers ---------- */

const food = (it) => FOODS[it.food] || FOODS.leftovers;
const itemName = (it) => (it.unknown ? "Unknown item" : it.name || food(it).name);
const itemIcon = (it) => (it.unknown ? "unknown" : food(it).icon);
const sorted = () => [...state.items].sort((a, b) => a.days - b.days);
const memberName = (id) => (MEMBERS.find((m) => m.id === id) || {}).name || "";
const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function daysLabel(d) {
  if (d <= 0) return "today";
  return d === 1 ? "1 day" : d + " days";
}
function urgency(d) { return d <= 2 ? "soon" : d <= 4 ? "mid" : "later"; }

function dayPill(it) {
  if (it.unknown) return `<span class="pill pill-dash">verify</span>`;
  return `<span class="pill pill-${urgency(it.days)}">${daysLabel(it.days)}</span>`;
}

function ownerTag(it) {
  if (it.owner === "free") return `<span class="tag tag-free">free for everyone</span>`;
  if (it.owner === ME) return `<span class="tag tag-mine">mine</span>`;
  return `<span class="tag">${esc(memberName(it.owner))}</span>`;
}

function dateIn(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function agoLabel(n) { return n === 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago"; }

const fmtKg = (n) => (Math.round(n * 10) / 10).toString();
const fmtMoney = (n) => Math.round(n).toString();

function pushFeed(dir, name) {
  state.feed.unshift({ dir, name, time: now() });
  state.feed = state.feed.slice(0, 6);
}

function rescue(items) {
  // Food that got eaten instead of binned adds to the totals.
  let value = 0, kg = 0;
  items.forEach((it) => { value += food(it).value; kg += food(it).kg; });
  state.stats.money += value;
  state.stats.kg += kg;
  state.stats.co2 += kg * CO2_PER_KG;
  state.statsDot = true;
  return { value, kg };
}

/* ---------- recipes (rule based) ---------- */

function rankedRecipes() {
  const byFood = new Map();
  state.items.forEach((it) => { if (!it.unknown && !byFood.has(it.food)) byFood.set(it.food, it); });
  const ready = [], almost = [];
  RECIPES.forEach((r) => {
    const have = r.uses.filter((u) => byFood.has(u)).map((u) => byFood.get(u));
    const missing = r.uses.filter((u) => !byFood.has(u));
    // Items that expire sooner weigh more.
    const urg = have.map((it) => 1 / (Math.max(it.days, 0) + 1));
    const score = have.length ? Math.max(...urg) + urg.reduce((x, y) => x + y, 0) / urg.length - r.time / 1000 : 0;
    const entry = { r, have, missing, score };
    if (!missing.length) ready.push(entry);
    else if (missing.length === 1 && have.length) almost.push(entry);
  });
  ready.sort((a, b) => b.score - a.score);
  almost.sort((a, b) => b.score - a.score);
  return { ready, almost };
}

/* ---------- views ---------- */

function rowHTML(it, opts = {}) {
  const u = it.unknown ? "unknown" : urgency(it.days);
  return `
  <li class="row row-${u}${flashId === it.id ? " row-new" : ""}" data-id="${it.id}">
    <button class="row-btn" data-action="open-item" data-id="${it.id}">
      ${icon(itemIcon(it), "ic-food")}
      <span class="row-main">
        <span class="row-name">${esc(itemName(it))}</span>
        <span class="row-sub">${it.unknown ? "Unknown: please verify" : opts.sub === "in" ? esc(agoLabel(it.inAgo) + ", " + it.inTime) : ownerTag(it)}</span>
      </span>
      ${opts.tag ? ownerTag(it) : dayPill(it)}
    </button>
  </li>`;
}

function renderFridge() {
  const items = sorted();
  const soon = items.filter((it) => !it.unknown && it.days <= 2);
  const lead = soon.length
    ? `<button class="lead" data-action="tab" data-tab="cook">
         <span class="ring"><b>${soon.length}</b></span>
         <span class="lead-text">
           <span class="lead-top">to eat first</span>
           <span class="lead-names">${esc(soon.map(itemName).join(", "))}</span>
         </span>
         ${icon("chevron", "ic-sm")}
       </button>`
    : `<div class="lead lead-calm">
         <span class="ring">${icon("check")}</span>
         <span class="lead-text"><span class="lead-top">nothing urgent</span><span class="lead-names">Everything is good for 3 days or more</span></span>
       </div>`;
  return `
    <div class="head">
      <h1>My fridge</h1>
      <span class="pill pill-later">${items.length} items</span>
    </div>
    ${lead}
    <ul class="list" data-flip>
      ${items.map((it) => rowHTML(it)).join("")}
    </ul>
    <h2 class="label">Recent</h2>
    <ul class="feed">
      ${state.feed.map((f) => `
        <li><span class="dir dir-${f.dir}">${f.dir}</span><span class="feed-name">${esc(f.name)}</span><span class="feed-time">${esc(f.time)}</span></li>`).join("")}
    </ul>`;
}

function usesHTML(have, missing = []) {
  return `<ul class="uses">
    ${have.map((it) => `<li>${icon(itemIcon(it), "ic-food")}<span>${esc(itemName(it))}</span>${dayPill(it)}</li>`).join("")}
    ${missing.map((m) => `<li class="missing">${icon(FOODS[m].icon, "ic-food")}<span>${esc(FOODS[m].name)}</span><span class="pill pill-dash">missing</span></li>`).join("")}
  </ul>`;
}

function metaHTML(r) {
  return `<span class="meta">${icon("clock", "ic-sm")}${r.time} min</span><span class="meta">${icon("level", "ic-sm")}${r.level}</span>`;
}

function renderCook() {
  const { ready, almost } = rankedRecipes();
  if (!ready.length) {
    return `
      <div class="head head-stack"><h1>Cook tonight</h1><p class="sub">Recipes from what you have</p></div>
      <p class="empty">Nothing matches what is in the fridge right now. Add food, or reset the demo in settings.</p>`;
  }
  const [top, ...rest] = ready;
  return `
    <div class="head head-stack"><h1>Cook tonight</h1><p class="sub">Recipes from what you have, soonest to expire first</p></div>
    <article class="feature">
      <p class="over">Best tonight</p>
      <h2 class="dish">${esc(top.r.name)}</h2>
      <p class="metas">${metaHTML(top.r)}</p>
      <p class="over over-sm">Uses</p>
      ${usesHTML(top.have)}
      <div class="feature-actions">
        <button class="btn btn-solid" data-action="cook" data-id="${top.r.id}">I cooked this</button>
        <button class="btn" data-action="open-recipe" data-id="${top.r.id}">Recipe</button>
      </div>
    </article>
    ${rest.length ? `<h2 class="label">Also possible</h2>
    <ul class="list recipes">
      ${rest.map(({ r, have }) => `
        <li class="row"><button class="row-btn" data-action="open-recipe" data-id="${r.id}">
          <span class="row-main">
            <span class="row-name">${esc(r.name)}</span>
            <span class="row-sub">${r.time} min · ${r.level} · ${esc(have.map(itemName).join(", "))}</span>
          </span>
          ${icon("chevron", "ic-sm ic-grey")}
        </button></li>`).join("")}
    </ul>` : ""}
    ${almost.length ? `<h2 class="label">One item short</h2>
    <ul class="list recipes almost">
      ${almost.slice(0, 3).map(({ r, missing }) => `
        <li class="row"><button class="row-btn" data-action="open-recipe" data-id="${r.id}">
          <span class="row-main">
            <span class="row-name">${esc(r.name)}</span>
            <span class="row-sub">Needs ${esc(FOODS[missing[0]].name.toLowerCase())}</span>
          </span>
          ${icon("chevron", "ic-sm ic-grey")}
        </button></li>`).join("")}
    </ul>` : ""}`;
}

function renderStats() {
  const s = state.stats;
  const board = LEADERBOARD.map((f) => (f.you ? { ...f, money: s.money } : f)).sort((a, b) => b.money - a.money);
  return `
    <div class="head"><h1>Stats</h1><span class="pill pill-later">${esc(FLAT_NAME)}</span></div>
    <section class="money">
      <p class="money-n"><span class="cur">€</span><span data-count="money">${fmtMoney(shown.money)}</span></p>
      <p class="money-l">saved so far</p>
    </section>
    <section class="streak">
      <span class="ring ring-lg"><b>${s.streak}</b></span>
      <span class="lead-text">
        <span class="lead-top">${s.streak === 1 ? "week" : "weeks"}</span>
        <span class="lead-names">${s.streak > 0 ? "Zero-waste streak" : "Streak reset. Start a new one this week."}</span>
      </span>
    </section>
    <ul class="facts">
      <li><span>Food saved</span><b><span data-count="kg">${fmtKg(shown.kg)}</span> kg</b></li>
      <li><span>CO<sub>2</sub> avoided</span><b><span data-count="co2">${fmtKg(shown.co2)}</span> kg</b></li>
      <li><span>Waste vs. last month</span><b>${s.delta < 0 ? "−" : "+"}${Math.abs(s.delta)}%</b></li>
    </ul>
    <h2 class="label">Badges</h2>
    <ul class="badges">
      ${BADGES.map((b) => `<li class="${b.earned ? "" : "locked"}"><span class="ring ring-md"><b>${b.big}</b></span><span>${esc(b.label)}</span>${b.earned ? "" : `<i>3 of 4 weeks</i>`}</li>`).join("")}
    </ul>
    <h2 class="label">Flat versus flat</h2>
    <ol class="board">
      ${board.map((f, i) => `<li class="${f.you ? "you" : ""}"><span class="rank">${i + 1}</span><span class="flat">${esc(f.name)}${f.you ? ` <span class="tag tag-mine">you</span>` : ""}</span><b>€${fmtMoney(f.money)}</b></li>`).join("")}
    </ol>
    <p class="note">Demo with simulated data.</p>`;
}

function renderShared() {
  const items = sorted().filter((it) => sharedFilter === "all" || (sharedFilter === "mine" ? it.owner === ME : it.owner === "free"));
  const count = (id) => state.items.filter((it) => it.owner === id).length;
  const f = (id, label) => `<button class="seg${sharedFilter === id ? " on" : ""}" data-action="filter" data-filter="${id}" aria-pressed="${sharedFilter === id}">${label}</button>`;
  return `
    <div class="head head-stack"><h1>Shared</h1><p class="sub">${esc(FLAT_NAME)} · ${MEMBERS.length} people, one fridge</p></div>
    <ul class="members">
      ${MEMBERS.map((m) => `<li><span class="ring ring-sm"><b>${esc(m.name[0])}</b></span><span class="m-name">${esc(m.name)}${m.id === ME ? ` <span class="tag tag-mine">you</span>` : ""}</span><span class="m-count">${count(m.id)} ${count(m.id) === 1 ? "item" : "items"}</span></li>`).join("")}
      <li><span class="ring ring-sm ring-fill"><b>${count("free")}</b></span><span class="m-name">Free for everyone</span><span class="m-count">help yourself</span></li>
    </ul>
    <div class="segs" role="group" aria-label="Filter items">
      ${f("all", "Everything")}${f("mine", "Only mine")}${f("free", "Free")}
    </div>
    <ul class="list" data-flip>
      ${items.length ? items.map((it) => rowHTML(it, { tag: true, sub: "in" })).join("") : `<li class="empty">Nothing here.</li>`}
    </ul>`;
}

const RENDER = { fridge: renderFridge, cook: renderCook, stats: renderStats, shared: renderShared };

/* ---------- drawing, with small motion ---------- */

const viewEl = $("#view");

function positions() {
  const map = new Map();
  $$("[data-flip] > [data-id]", viewEl).forEach((el) => map.set(el.dataset.id, el.getBoundingClientRect().top));
  return map;
}

function draw({ animate = false, enter = false } = {}) {
  const before = animate ? positions() : null;
  viewEl.innerHTML = RENDER[view]();
  viewEl.dataset.view = view;
  if (enter) {
    viewEl.classList.remove("enter");
    void viewEl.offsetWidth;
    viewEl.classList.add("enter");
  }
  if (before) {
    $$("[data-flip] > [data-id]", viewEl).forEach((el) => {
      const old = before.get(el.dataset.id);
      if (old == null) return;
      const dy = old - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) return;
      el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
    });
  }
  const fresh = $(".row-new", viewEl);
  if (fresh) fresh.scrollIntoView({ block: "nearest", behavior: "smooth" });
  flashId = null;
  if (view === "stats") countUp();
  drawChrome();
}

function drawChrome() {
  $$(".tab").forEach((t) => {
    const on = t.dataset.tab === view;
    t.classList.toggle("on", on);
    t.setAttribute("aria-current", on ? "page" : "false");
  });
  $("#tab-stats-dot").hidden = !state.statsDot || view === "stats";
  $("#bell-dot").hidden = state.seenNotifs || !notifications().length;
}

function countUp() {
  const target = { money: state.stats.money, kg: state.stats.kg, co2: state.stats.co2 };
  const from = { ...shown };
  const fmt = { money: fmtMoney, kg: fmtKg, co2: fmtKg };
  const els = {};
  $$("[data-count]", viewEl).forEach((el) => (els[el.dataset.count] = el));
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t0 = performance.now(), dur = still ? 1 : 900;
  function tick(t) {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    for (const k in target) if (els[k] && els[k].isConnected) els[k].textContent = fmt[k](from[k] + (target[k] - from[k]) * e);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  shown = { ...target };
  state.statsDot = false;
  save();
}

function go(tab) {
  if (!RENDER[tab]) return;
  view = tab;
  $("#scroll").scrollTop = 0;
  draw({ enter: true });
}

/* ---------- toast ---------- */

let toastTimer;
function toast(text, ic) {
  const el = $("#toast");
  el.innerHTML = (ic ? icon(ic, "ic-sm") : "") + `<span>${esc(text)}</span>`;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* ---------- sheets ---------- */

const sheet = $("#sheet"), scrim = $("#scrim");
let sheetCtx = null;

function openSheet(html, ctx) {
  sheetCtx = ctx || null;
  $("#sheet-body").innerHTML = html;
  scrim.hidden = false; sheet.hidden = false;
  void sheet.offsetWidth;
  scrim.classList.add("show"); sheet.classList.add("show");
  sheet.scrollTop = 0;
}
function closeSheet() {
  sheetCtx = null;
  scrim.classList.remove("show"); sheet.classList.remove("show");
  setTimeout(() => { if (!sheet.classList.contains("show")) { scrim.hidden = true; sheet.hidden = true; } }, 320);
}

function itemSheet(id) {
  const it = state.items.find((x) => x.id === id);
  if (!it) return closeSheet();
  const fd = food(it);
  if (it.unknown) {
    openSheet(`
      <div class="s-head">${icon("unknown", "ic-xl")}
        <div><p class="over">Unknown: please verify</p><h2 class="dish">What went in?</h2></div>
      </div>
      <p class="s-text">The camera could not see this item clearly at ${esc(it.inTime)}. Covered or unclear items always ask you first.</p>
      <ul class="s-rows"><li><span>Best guess</span><b>${esc(fd.name)}</b></li></ul>
      <button class="btn btn-solid btn-wide" data-action="confirm" data-id="${it.id}">Yes, it is ${esc(fd.name.toLowerCase())}</button>
      <form class="rename" data-action="rename" data-id="${it.id}">
        <label class="over over-sm" for="rename-in">Or name it</label>
        <div class="rename-row">
          <input id="rename-in" name="name" type="text" autocomplete="off" autocapitalize="sentences" maxlength="24" placeholder="e.g. Pesto" enterkeyhint="done">
          <button class="btn" type="submit">Save</button>
        </div>
      </form>`, { type: "item", id });
    return;
  }
  const owners = [...MEMBERS.map((m) => ({ id: m.id, label: m.id === ME ? "Mine" : m.name })), { id: "free", label: "Free for everyone" }];
  openSheet(`
    <div class="s-head">${icon(itemIcon(it), "ic-xl")}
      <div><h2 class="dish">${esc(itemName(it))}</h2><p class="s-pill">${dayPill(it)}<span class="grey">left</span></p></div>
    </div>
    <ul class="s-rows">
      <li><span>Went in</span><b>${esc(agoLabel(it.inAgo))}, ${esc(it.inTime)}</b></li>
      <li><span>Estimated expiry</span>
        <span class="stepper">
          <button class="round" data-action="days" data-d="-1" data-id="${it.id}" aria-label="One day sooner">${icon("minus", "ic-sm")}</button>
          <b>${esc(dateIn(it.days))}</b>
          <button class="round" data-action="days" data-d="1" data-id="${it.id}" aria-label="One day later">${icon("plus", "ic-sm")}</button>
        </span>
      </li>
      <li class="col"><span>Belongs to</span>
        <span class="chips">${owners.map((o) => `<button class="seg${it.owner === o.id ? " on" : ""}" data-action="owner" data-owner="${o.id}" data-id="${it.id}" aria-pressed="${it.owner === o.id}">${esc(o.label)}</button>`).join("")}</span>
      </li>
      <li class="col"><span>Nutrition</span>
        <span class="meter-wrap"><span class="meter" role="img" aria-label="${fd.nutri} out of 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= fd.nutri ? "on" : ""}"></i>`).join("")}</span><span class="grey">${esc(fd.note)}</span></span>
      </li>
    </ul>
    <div class="s-actions">
      <button class="btn btn-solid" data-action="used" data-id="${it.id}">Used it</button>
      <button class="btn" data-action="binned" data-id="${it.id}">Threw it away</button>
    </div>`, { type: "item", id });
}

function recipeSheet(id) {
  const { ready, almost } = rankedRecipes();
  const e = [...ready, ...almost].find((x) => x.r.id === id);
  if (!e) return;
  const r = e.r;
  openSheet(`
    <p class="over">Recipe</p>
    <h2 class="dish">${esc(r.name)}</h2>
    <p class="metas">${metaHTML(r)}</p>
    <p class="over over-sm">From your fridge</p>
    ${usesHTML(e.have, e.missing)}
    <ul class="s-rows"><li><span>From the cupboard</span><b>${esc(r.pantry)}</b></li></ul>
    <ol class="method">${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    ${e.missing.length ? "" : `<button class="btn btn-solid btn-wide" data-action="cook" data-id="${r.id}">I cooked this</button>`}`, { type: "recipe", id });
}

function notifications() {
  const list = [];
  sorted().forEach((it) => {
    if (it.unknown) list.push({ id: it.id, text: "Unknown item: please verify", sub: "Went in at " + it.inTime });
    else if (it.days <= 2) list.push({ id: it.id, text: `${itemName(it)} expires ${it.days <= 0 ? "today" : "in " + daysLabel(it.days)}`, sub: it.owner === "free" ? "Free for everyone" : it.owner === ME ? "Yours" : memberName(it.owner) + "'s" });
  });
  return list;
}

function notifSheet() {
  const list = notifications();
  state.seenNotifs = true; save(); drawChrome();
  openSheet(`
    <p class="over">Notifications</p>
    <h2 class="dish">${list.length ? "Before it goes" : "All clear"}</h2>
    <ul class="list notif">
      ${list.map((n) => `<li class="row"><button class="row-btn" data-action="open-item" data-id="${n.id}">
        <span class="row-main"><span class="row-name">${esc(n.text)}</span><span class="row-sub">${esc(n.sub)}</span></span>${icon("chevron", "ic-sm ic-grey")}</button></li>`).join("") || `<li class="empty">Nothing expires in the next two days.</li>`}
    </ul>
    <p class="note">Shown in the app only. The demo sends no push notifications.</p>`);
}

function settingsSheet() {
  openSheet(`
    <p class="over">Settings</p>
    <h2 class="dish">Demo</h2>
    <p class="s-text">FridgeMate is a concept at prototype stage. This demo uses simulated data: there is no real camera, account or server behind it.</p>
    <ul class="s-rows">
      <li><span>Camera</span><b>Portable, on-device AI</b></li>
      <li><span>Video upload</span><b>None</b></li>
    </ul>
    <button class="btn btn-wide" data-action="reset">${icon("reset", "ic-sm")}Reset demo</button>
    <a class="btn btn-wide btn-quiet" href="../">About FridgeMate${icon("arrow", "ic-sm")}</a>`);
}

/* ---------- actions ---------- */

function removeItems(ids) {
  const gone = state.items.filter((it) => ids.includes(it.id));
  state.items = state.items.filter((it) => !ids.includes(it.id));
  return gone;
}

function cameraEvent() {
  const have = new Set(state.items.map((it) => it.food));
  let ev = null;
  for (let i = 0; i < CAMERA_EVENTS.length; i++) {
    const c = CAMERA_EVENTS[(state.cam + i) % CAMERA_EVENTS.length];
    if (!have.has(c.food)) { ev = c; state.cam = (state.cam + i + 1) % CAMERA_EVENTS.length; break; }
  }
  if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
  if (!ev) { toast("Door opened. Nothing new.", "camera"); return; }
  const id = "c" + (++state.seq);
  state.items.push({ id, food: ev.food, days: ev.days, inAgo: 0, inTime: now(), owner: ev.owner });
  pushFeed("in", FOODS[ev.food].name);
  state.seenNotifs = false;
  save();
  flashId = id;
  toast(`${FOODS[ev.food].name} detected, added`, "camera");
  if (view === "stats") { drawChrome(); flashId = null; } else draw({ animate: true });
}

const ACTIONS = {
  tab: (el) => go(el.dataset.tab),
  "open-item": (el) => itemSheet(el.dataset.id),
  "open-recipe": (el) => recipeSheet(el.dataset.id),
  bell: () => notifSheet(),
  settings: () => settingsSheet(),
  close: () => closeSheet(),
  filter: (el) => { sharedFilter = el.dataset.filter; draw({ animate: true }); },

  days: (el) => {
    const it = state.items.find((x) => x.id === el.dataset.id); if (!it) return;
    it.days = Math.max(0, Math.min(60, it.days + Number(el.dataset.d)));
    save(); itemSheet(it.id); draw({ animate: true });
  },
  owner: (el) => {
    const it = state.items.find((x) => x.id === el.dataset.id); if (!it) return;
    it.owner = el.dataset.owner;
    save(); itemSheet(it.id); draw({ animate: true });
  },
  confirm: (el) => {
    const it = state.items.find((x) => x.id === el.dataset.id); if (!it) return;
    it.unknown = false;
    save(); closeSheet(); flashId = it.id; draw({ animate: true });
    toast(`Saved as ${itemName(it)}.`, "check");
  },
  used: (el) => {
    const [it] = removeItems([el.dataset.id]); if (!it) return;
    const { value } = rescue([it]);
    pushFeed("out", itemName(it));
    save(); closeSheet(); draw({ animate: true });
    toast(`${itemName(it)} used. €${value.toFixed(2)} not wasted.`, "check");
  },
  binned: (el) => {
    const [it] = removeItems([el.dataset.id]); if (!it) return;
    state.stats.streak = 0;
    state.statsDot = true;
    pushFeed("out", itemName(it));
    save(); closeSheet(); draw({ animate: true });
    toast(`${itemName(it)} logged as waste. Streak reset.`);
  },
  cook: (el) => {
    const { ready } = rankedRecipes();
    const e = ready.find((x) => x.r.id === el.dataset.id); if (!e) return;
    const gone = removeItems(e.have.map((it) => it.id));
    const { value } = rescue(gone);
    gone.forEach((it) => pushFeed("out", itemName(it)));
    save(); closeSheet();
    $("#scroll").scrollTop = 0;
    draw({ enter: true });
    toast(`Cooked. ${gone.length} items used, €${Math.round(value)} saved.`, "check");
  },
  reset: () => {
    state = seed(); save();
    sharedFilter = "all"; shown = { money: 0, kg: 0, co2: 0 };
    closeSheet(); view = "fridge"; $("#scroll").scrollTop = 0;
    draw({ enter: true });
    toast("Demo reset.", "reset");
  },
};

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el || el.tagName === "FORM") return;
  if (el.id === "logo") return; // handled by long press
  const fn = ACTIONS[el.dataset.action];
  if (fn) fn(el);
});

document.addEventListener("submit", (ev) => {
  const form = ev.target.closest("form[data-action='rename']");
  if (!form) return;
  ev.preventDefault();
  const name = form.elements.name.value.trim();
  if (!name) { form.elements.name.focus(); return; }
  const it = state.items.find((x) => x.id === form.dataset.id); if (!it) return;
  it.unknown = false; it.name = name; it.food = "leftovers"; it.custom = true;
  save(); closeSheet(); flashId = it.id; draw({ animate: true });
  toast(`Saved as ${name}.`, "check");
});

scrim.addEventListener("click", closeSheet);
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeSheet();
  // Presenter shortcut on a laptop: C fires the camera event.
  if ((ev.key === "c" || ev.key === "C") && !ev.metaKey && !ev.ctrlKey && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) cameraEvent();
});

/* ---------- hidden demo control: long press on the logo ---------- */

const logo = $("#logo");
let pressTimer = null;
const cancelPress = () => { clearTimeout(pressTimer); pressTimer = null; logo.classList.remove("pressing"); };
logo.addEventListener("pointerdown", () => {
  logo.classList.add("pressing");
  pressTimer = setTimeout(() => { cancelPress(); cameraEvent(); }, 550);
});
["pointerup", "pointerleave", "pointercancel"].forEach((t) => logo.addEventListener(t, cancelPress));
logo.addEventListener("contextmenu", (ev) => ev.preventDefault());

/* ---------- start ---------- */

// Custom-named items keep their name; the icon falls back to a container.
draw({ enter: true });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("../sw.js").catch(() => {}));
}
