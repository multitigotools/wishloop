const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

/* ===============================
   FESTIVAL CONFIG
================================ */
const festivals = {
  "Mother's Day": {
    name: "Mother's Day",
    themeColor: "#22c55e"
  },
  "Birthday": {
    name: "Birthday",
    themeColor: "#f59e0b"
  },
  "Diwali": {
    name: "Diwali",
    themeColor: "#f97316"
  }
};

/* ===============================
   HOME PAGE
================================ */
app.get("/", (req, res) => {
  res.redirect("/wishloop");
});

/* ===============================
   FORM PAGE
================================ */
app.get("/wishloop", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>WishLoop 🎁</title>
    <style>
      body {
        text-align:center;
        background:#0f172a;
        color:#fff;
        font-family:Arial;
        padding:40px;
      }
      input, textarea, select {
        display:block;
        margin:10px auto;
        padding:10px;
        width:250px;
      }
      button {
        padding:12px 20px;
        background:#22c55e;
        border:none;
        color:#000;
        font-weight:bold;
        cursor:pointer;
      }
    </style>
  </head>
  <body>

    <h1>🎁 WishLoop</h1>
    <p>Create → Send → Spread Wishes</p>

    <form action="/create" method="POST">
      <select name="festival">
        <option>Mother's Day</option>
        <option>Birthday</option>
        <option>Diwali</option>
      </select>

      <input name="from" placeholder="Your Name" required />
      <input name="to" placeholder="Receiver Name" required />
      <textarea name="message" placeholder="Write your message" required></textarea>

      <button type="submit">Create & Share 🚀</button>
    </form>

  </body>
  </html>
  `);
});

/* ===============================
   CREATE CARD
================================ */
app.post("/create", (req, res) => {
  const { from, to, message, festival } = req.body;

  const fest = festivals[festival] || festivals["Birthday"];

  const id = Date.now(); // simple ID

  const link = `https://multitigo.com/wishloop/card/${id}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}&festival=${encodeURIComponent(festival)}`;

  res.send(`
  <html>
  <head>
    <title>Your Wish is Ready 🎉</title>
    <style>
      body {
        text-align:center;
        background:#0f172a;
        color:#fff;
        font-family:Arial;
        padding:40px;
      }

      input {
        width:80%;
        padding:10px;
        margin-top:20px;
      }

      .btn {
        margin-top:20px;
        display:inline-block;
        padding:12px 20px;
        background:${fest.themeColor};
        color:#000;
        text-decoration:none;
        border-radius:6px;
        cursor:pointer;
      }
    </style>
  </head>

  <body>

    <h2>🎉 Your Wish is Ready!</h2>

    <input id="linkBox" value="${link}" readonly />

    <br/>

    <button class="btn" onclick="copyLink()">📋 Copy Link</button>

    <br/>

    <a class="btn" href="https://wa.me/?text=${encodeURIComponent("Check this wish 🎁 👉 " + link)}">
      📲 Share on WhatsApp
    </a>

    <script>
      function copyLink() {
        const copyText = document.getElementById("linkBox");
        copyText.select();
        document.execCommand("copy");
        alert("Link copied!");
      }
    </script>

  </body>
  </html>
  `);
});

/* ===============================
   VIEW CARD
================================ */
app.get("/wishloop/card/:id", (req, res) => {
  const { from, to, message, festival } = req.query;

  const fest = festivals[festival] || festivals["Birthday"];

  const imageUrl = "https://multitigo.com/wp-content/uploads/2024/01/greeting.jpg"; 
  // 👉 Replace with your real image

  res.send(`
  <html>
  <head>
    <title>🎁 You received a Wish!</title>

    <!-- WhatsApp Preview -->
    <meta property="og:title" content="${from} sent you a ${fest.name} wish 🎉" />
    <meta property="og:description" content="${message}" />
    <meta property="og:image" content="${imageUrl}" />

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

      .container {
        background:#111827;
        padding:30px;
        border-radius:16px;
        width:90%;
        max-width:400px;
        text-align:center;
        box-shadow:0 10px 30px rgba(0,0,0,0.5);
      }

      .title {
        font-size:22px;
        margin-bottom:10px;
      }

      .image {
        width:100%;
        border-radius:12px;
        margin-bottom:20px;
      }

      .card {
        background:#1f2937;
        padding:15px;
        border-radius:10px;
        margin-top:10px;
      }

      .btn {
        margin-top:20px;
        padding:12px;
        width:100%;
        border:none;
        border-radius:8px;
        font-weight:bold;
        cursor:pointer;
        background:${fest.themeColor};
        color:black;
        font-size:16px;
      }

      .btn:hover {
        opacity:0.9;
      }
    </style>
  </head>

  <body>

    <div class="container">

      <h2 class="title">🎉 You got a Wish!</h2>

      <img src="${imageUrl}" class="image"/>

      <h3>${from} → ${to}</h3>

      <div class="card">
        ${message}
      </div>

      <a href="https://multitigo.com/wishloop">
        <button class="btn">👉 Create Your Own</button>
      </a>

    </div>

  </body>
  </html>
  `);
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
