const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas } = require("canvas");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/* ===============================
   FESTIVAL CONFIG
================================ */
const festivals = {
  "Birthday": {
    name: "Birthday",
    color: "#ff6b6b"
  },
  "Diwali": {
    name: "Diwali",
    color: "#f59e0b"
  },
  "Mother's Day": {
    name: "Mother's Day",
    color: "#22c55e"
  }
};

/* ===============================
   HOME
================================ */
app.get("/", (req, res) => {
  res.redirect("/wishloop");
});

/* ===============================
   FORM UI (PREMIUM)
================================ */
app.get("/wishloop", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>WishLoop 🎁</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <style>
      body {
        margin:0;
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color:white;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
      }

      .box {
        background:#111827;
        padding:30px;
        border-radius:16px;
        width:90%;
        max-width:400px;
        text-align:center;
      }

      input, textarea, select {
        width:100%;
        padding:12px;
        margin:10px 0;
        border-radius:8px;
        border:none;
      }

      button {
        width:100%;
        padding:14px;
        border:none;
        border-radius:8px;
        background:#22c55e;
        font-weight:bold;
        cursor:pointer;
      }
    </style>
  </head>

  <body>

    <div class="box">
      <h2>🎁 WishLoop</h2>

      <form action="/create" method="POST">
        <select name="festival">
          <option>Birthday</option>
          <option>Diwali</option>
          <option>Mother's Day</option>
        </select>

        <input name="from" placeholder="Your Name" required />
        <input name="to" placeholder="Receiver Name" required />
        <textarea name="message" placeholder="Write your message" required></textarea>

        <button>Create & Share 🚀</button>
      </form>
    </div>

  </body>
  </html>
  `);
});

/* ===============================
   CREATE LINK
================================ */
app.post("/create", (req, res) => {
  const { from, to, message, festival } = req.body;

  const id = Date.now();

  const link = `https://multitigo.com/wishloop/card/${id}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}&festival=${festival}`;

  res.send(`
  <html>
  <body style="text-align:center;background:#0f172a;color:white;padding:40px;">
    <h2>🎉 Your Wish is Ready!</h2>

    <input value="${link}" style="width:80%;padding:10px"/>

    <br/><br/>

    <a href="https://wa.me/?text=${encodeURIComponent("🎁 Someone sent you a surprise 👉 " + link)}">
      <button style="padding:12px;background:#22c55e;">Share on WhatsApp</button>
    </a>
  </body>
  </html>
  `);
});

/* ===============================
   DYNAMIC IMAGE GENERATION
================================ */
app.get("/generate-image/:id", (req, res) => {
  const { from, message, festival } = req.query;

  const fest = festivals[festival] || festivals["Birthday"];

  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = fest.color;
  ctx.fillRect(0, 0, 1200, 630);

  // Text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 60px Arial";
  ctx.fillText(fest.name + " Wish 🎉", 100, 150);

  ctx.font = "40px Arial";
  ctx.fillText("From: " + from, 100, 250);

  ctx.font = "30px Arial";
  ctx.fillText(message.substring(0, 50), 100, 350);

  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
});

/* ===============================
   CARD VIEW (WHATSAPP PREVIEW)
================================ */
app.get("/wishloop/card/:id", (req, res) => {
  const { from, to, message, festival } = req.query;

  const imageUrl = `https://multitigo.com/generate-image/${req.params.id}?from=${encodeURIComponent(from)}&message=${encodeURIComponent(message)}&festival=${festival}`;

  res.send(`
  <html>
  <head>

    <meta property="og:title" content="${from} sent you a wish 🎁" />
    <meta property="og:description" content="${message}" />
    <meta property="og:image" content="${imageUrl}" />

  </head>

  <body style="text-align:center;background:#0f172a;color:white;padding:40px;">

    <h2>${from} → ${to}</h2>
    <p>${message}</p>

    <img src="${imageUrl}" style="width:300px;border-radius:12px"/>

    <br/><br/>

    <a href="https://multitigo.com/wishloop">
      <button style="padding:12px;background:#22c55e;">Create Your Own</button>
    </a>

  </body>
  </html>
  `);
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
