// FridgeMate demo — all content lives here. Everything is simulated.
// Edit this file to change items, recipes, flatmates or the seed numbers,
// then bump SEED_VERSION so phones that already opened the demo pick it up.

export const SEED_VERSION = 1;

// The person holding the phone.
export const ME = "benedek";

export const MEMBERS = [
  { id: "benedek", name: "Benedek" },
  { id: "lili", name: "Lili" },
  { id: "mark", name: "Márk" },
];
export const FLAT_NAME = "Flat 7";

// Food catalogue. value = euros, kg = weight, nutri = 1 to 5.
export const FOODS = {
  milk:      { name: "Milk",           icon: "milk",      value: 1.2, kg: 1.0, nutri: 3, note: "Protein and calcium" },
  chicken:   { name: "Chicken breast", icon: "chicken",   value: 4.5, kg: 0.5, nutri: 4, note: "Lean protein" },
  spinach:   { name: "Spinach",        icon: "spinach",   value: 1.8, kg: 0.2, nutri: 5, note: "Iron and vitamins" },
  tomatoes:  { name: "Tomatoes",       icon: "tomato",    value: 2.2, kg: 0.5, nutri: 5, note: "Vitamin C, low calorie" },
  mushrooms: { name: "Mushrooms",      icon: "mushroom",  value: 1.9, kg: 0.25, nutri: 4, note: "Low calorie, some fibre" },
  apples:    { name: "Apples",         icon: "apple",     value: 1.6, kg: 0.6, nutri: 4, note: "Fibre, natural sugar" },
  lettuce:   { name: "Lettuce",        icon: "lettuce",   value: 1.1, kg: 0.3, nutri: 4, note: "Light, mostly water" },
  pepper:    { name: "Bell pepper",    icon: "pepper",    value: 1.0, kg: 0.2, nutri: 5, note: "Rich in vitamin C" },
  cheese:    { name: "Cheese",         icon: "cheese",    value: 3.2, kg: 0.25, nutri: 2, note: "Protein, high in fat" },
  carrots:   { name: "Carrots",        icon: "carrot",    value: 0.9, kg: 0.5, nutri: 5, note: "Fibre and vitamin A" },
  eggs:      { name: "Eggs",           icon: "egg",       value: 2.4, kg: 0.4, nutri: 4, note: "Complete protein" },
  hummus:    { name: "Hummus",         icon: "bowl",      value: 2.0, kg: 0.2, nutri: 4, note: "Plant protein and fibre" },
  yoghurt:   { name: "Yoghurt",        icon: "yoghurt",   value: 1.4, kg: 0.5, nutri: 4, note: "Protein, live cultures" },
  juice:     { name: "Orange juice",   icon: "bottle",    value: 2.1, kg: 1.0, nutri: 2, note: "Vitamin C, high in sugar" },
  leftovers: { name: "Leftovers",      icon: "container", value: 3.0, kg: 0.4, nutri: 3, note: "Depends what is inside" },
};

// What is in the fridge when the demo starts.
// days = days left, inAgo = days since it went in, owner = member id or "free".
export const SEED_ITEMS = [
  { food: "milk",      days: 2,  inAgo: 0, inTime: "18:42", owner: "free" },
  { food: "chicken",   days: 2,  inAgo: 1, inTime: "17:05", owner: "benedek" },
  { food: "spinach",   days: 3,  inAgo: 2, inTime: "19:20", owner: "lili" },
  { food: "hummus",    days: 4,  inAgo: 0, inTime: "18:43", owner: "free", unknown: true },
  { food: "tomatoes",  days: 4,  inAgo: 3, inTime: "12:10", owner: "benedek" },
  { food: "mushrooms", days: 4,  inAgo: 2, inTime: "19:21", owner: "free" },
  { food: "apples",    days: 5,  inAgo: 4, inTime: "08:30", owner: "free" },
  { food: "lettuce",   days: 5,  inAgo: 2, inTime: "19:20", owner: "lili" },
  { food: "pepper",    days: 6,  inAgo: 3, inTime: "12:11", owner: "benedek" },
  { food: "cheese",    days: 9,  inAgo: 5, inTime: "20:02", owner: "mark" },
  { food: "carrots",   days: 10, inAgo: 4, inTime: "08:31", owner: "benedek" },
  { food: "eggs",      days: 12, inAgo: 5, inTime: "20:02", owner: "free" },
];

// Recent door events, newest first.
export const SEED_FEED = [
  { dir: "out", name: "Leftovers", time: "19:10" },
  { dir: "in",  name: "Unknown item", time: "18:43" },
  { dir: "in",  name: "Milk", time: "18:42" },
  { dir: "out", name: "Butter", time: "08:14" },
];

// Fake camera events fired by a long press on the logo, in this order.
export const CAMERA_EVENTS = [
  { food: "yoghurt",   days: 7, owner: "benedek" },
  { food: "juice",     days: 6, owner: "free" },
  { food: "leftovers", days: 3, owner: "benedek" },
];

// Recipes. uses = fridge items (keys of FOODS). Matching is by rule:
// a recipe is offered when every item in "uses" is in the fridge, and
// recipes that use the items expiring soonest come first.
export const RECIPES = [
  {
    id: "chicken-spinach", name: "Creamy chicken and spinach", time: 25, level: "Easy",
    uses: ["chicken", "spinach", "milk"], pantry: "Rice, garlic, oil",
    steps: ["Brown the chicken in a little oil.", "Add garlic, spinach and a splash of milk.", "Simmer five minutes and serve over rice."],
  },
  {
    id: "tomato-pasta", name: "Tomato pasta", time: 15, level: "Easy",
    uses: ["tomatoes", "cheese"], pantry: "Pasta, garlic, oil",
    steps: ["Boil the pasta.", "Soften chopped tomatoes with garlic in oil.", "Toss together and grate the cheese on top."],
  },
  {
    id: "frittata", name: "Spinach and mushroom frittata", time: 20, level: "Easy",
    uses: ["spinach", "mushrooms", "eggs", "milk"], pantry: "Oil, salt",
    steps: ["Fry the mushrooms, then wilt the spinach.", "Pour over eggs beaten with a little milk.", "Cook gently until set, then flip or grill."],
  },
  {
    id: "stir-fry", name: "Chicken and pepper stir-fry", time: 20, level: "Medium",
    uses: ["chicken", "pepper", "carrots"], pantry: "Rice, soy sauce",
    steps: ["Slice everything thin.", "Fry the chicken hot and fast, then the vegetables.", "Add soy sauce and serve with rice."],
  },
  {
    id: "omelette", name: "Mushroom omelette", time: 10, level: "Easy",
    uses: ["mushrooms", "eggs", "cheese"], pantry: "Butter, salt",
    steps: ["Fry the mushrooms in butter.", "Add beaten eggs and stir gently.", "Fold over the cheese and serve."],
  },
  {
    id: "salad", name: "Garden salad with apple", time: 10, level: "Easy",
    uses: ["lettuce", "apples", "carrots"], pantry: "Oil, lemon",
    steps: ["Tear the lettuce, slice the apple, grate the carrot.", "Dress with oil and lemon.", "Eat straight away."],
  },
  {
    id: "stuffed-peppers", name: "Stuffed peppers", time: 35, level: "Medium",
    uses: ["pepper", "tomatoes", "mushrooms", "cheese"], pantry: "Rice, herbs",
    steps: ["Halve the peppers.", "Fill with rice, chopped tomatoes and mushrooms.", "Top with cheese and bake until soft."],
  },
  {
    id: "yoghurt-bowl", name: "Apple yoghurt bowl", time: 5, level: "Easy",
    uses: ["yoghurt", "apples"], pantry: "Oats, honey",
    steps: ["Chop the apple.", "Spoon yoghurt over oats.", "Top with apple and a little honey."],
  },
];

// Stats when the demo starts.
export const SEED_STATS = {
  money: 184,      // euros saved so far
  streak: 3,       // zero-waste weeks
  kg: 24,          // food saved
  co2: 46,         // kg CO2 avoided
  delta: -32,      // waste versus last month, percent
};
export const CO2_PER_KG = 1.9; // used when the demo adds to the totals

export const BADGES = [
  { id: "first", label: "First rescue", big: "1", earned: true },
  { id: "streak", label: "3-week streak", big: "3", earned: true },
  { id: "month", label: "Zero-waste month", big: "4", earned: false },
];

// Flat-versus-flat leaderboard (euros saved). "you" takes the live number.
export const LEADERBOARD = [
  { name: "Flat 12", money: 212 },
  { name: FLAT_NAME, you: true },
  { name: "Flat 3", money: 151 },
  { name: "Flat 9", money: 97 },
];
