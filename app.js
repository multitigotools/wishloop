const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());

/* =========================
   🎯 FESTIVAL CONFIG
========================= */

const festivals = [
  {
    slug: "mothersday",
    name: "Mother's Day",
    date: "2026-05-10",
    themeColor: "#ff4d6d"
  },
  {
    slug: "fathersday",
    name: "Father's Day",
    date: "2026-06-21",
    themeColor: "#4dabf7"
  },
  {
    slug: "diwali",
    name: "Diwali",
    date: "2026-11-12",
    themeColor: "#FFD700"
  },
  {
    slug: "christmas",
    name: "Christmas",
    date: "2026-12-25",
    themeColor: "#2ecc71"
  },
  {
    slug: "birthday",
    name: "Birthday",
    date: null,
    themeColor: "#ff922b"
  }
];

/* =========================
   🧠 STORAGE (MVP)
========================= */

const cards = [];

/* =========================
   🔮 NEXT FESTIVAL LOGIC
========================= */

function getNextFestival() {
  const today = new Date();

  const upcoming = festivals
    .filter(f => f.date)
    .map(f => ({
      ...f,
      diff: new Date(f.date) - today
    }))
    .filter(f => f.diff > 0)
    .sort((a, b) => a.diff - b.diff);

  return upcoming[0] || festivals[0];
}

/* =========================
   🌐 MAIN PAGE (WishLoop)
========================= */

app.get("/wishloop", (req, res) => {
  const nextFest = getNextFestival();

  const options = festivals.map(f =>
    `<option value="${f.slug}" ${f.slug === nextFest.slug ? "selected" : ""}>
      ${f.name}
    </option>`
  ).join("");

 res.send(`
<html>
<head>
  <title>Someone sent you a WishLoop 🎁</title>

  <meta property="og:title" content="Someone sent you a WishLoop 🎉" />
  <meta property="og:description" content="Tap to open your surprise message" />
  <meta property="og:image" content="/og/${card.id}" />

  <style>
    body {
      text-align:center;
      background:#0f172a;
      color:#fff;
      font-family:Arial;
      padding:40px;
    }

    .card {
      background:#1e293b;
      padding:20px;
      border-radius:10px;
      display:inline-block;
    }

    .btn {
      margin-top:20px;
      display:inline-block;
      padding:12px 20px;
      background:${fest.themeColor};
      color:#000;
      text-decoration:none;
      border-radius:6px;
    }
  </style>
</head>

<body>

  <h2>🎉 ${card.from} sent you a ${fest.name} wish</h2>

  <div class="card">
    <h3>To: ${card.to}</h3>
    <p>${card.message}</p>
  </div>

  <br/>

  <a class="btn" href="/wishloop">👉 Create your own</a>

</body>
</html>
`);

/* =========================
   🎯 CREATE CARD
========================= */
<a href="https://tool.multitigo.com/wishloop">
  Create Greeting Card 🎉
</a>

app.post("/create-card", (req, res) => {
  const { category, from, to, message } = req.body;

  const id = uuidv4();

  cards.push({ id, category, from, to, message });

  res.json({ link: "/card/" + id });
});

/* =========================
   🖼️ DYNAMIC OG IMAGE
========================= */

app.get("/og/:id", (req, res) => {
  const card = cards.find(c => c.id === req.params.id);
  if (!card) return res.send("Not found");

  const fest = festivals.find(f => f.slug === card.category);

  const canvas = createCanvas(600, 315);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 600, 315);

  ctx.fillStyle = fest.themeColor;
  ctx.font = "28px Arial";
  ctx.fillText(fest.name, 40, 60);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(card.from + " → " + card.to, 40, 130);

  ctx.font = "16px Arial";
  ctx.fillText(card.message.substring(0, 80), 40, 180);

  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
});

/* =========================
   🎉 CARD VIEW
========================= */

app.get("/card/:id", (req, res) => {
  const card = cards.find(c => c.id === req.params.id);
  if (!card) return res.send("Card not found");

  const fest = festivals.find(f => f.slug === card.category);

  res.send(`
<html>
<head>
  <title>Someone sent you a WishLoop 🎁</title>

  <meta property="og:title" content="Someone sent you a WishLoop 🎉" />
  <meta property="og:description" content="Tap to open your surprise message" />
  <meta property="og:image" content="/og/${card.id}" />

  <style>
    body {
      text-align:center;
      background:#0f172a;
      color:#fff;
      font-family:Arial;
      padding:40px;
    }

    .card {
      background:#1e293b;
      padding:20px;
      border-radius:10px;
      display:inline-block;
    }

    .btn {
      margin-top:20px;
      display:inline-block;
      padding:12px 20px;
      background:${fest.themeColor};
      color:#000;
      text-decoration:none;
      border-radius:6px;
    }
  </style>
</head>

<body>

  <h2>🎉 ${card.from} sent you a ${fest.name} wish</h2>

  <div class="card">
    <h3>To: ${card.to}</h3>
    <p>${card.message}</p>
  </div>

  <br/>

  <a class="btn" href="/wishloop">👉 Create your own</a>

</body>
</html>
`);

/* =========================
   🚀 START SERVER
========================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port " + PORT);
});
