const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/* ===============================
   MEMORY STORAGE
================================ */
const cards = {};

/* ===============================
   IMAGE SET (ADD YOUR 10 IMAGES)
================================ */
const images = [
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  "https://images.unsplash.com/photo-1521302080371-df14c8c8c52d",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
  "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba"
];

/* ===============================
   HOME
================================ */
app.get("/", (req, res) => {
  res.redirect("/wishloop");
});

/* ===============================
   FORM PAGE
================================ */
app.get("/wishloop", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>WishLoop 🎁</title>

    <style>
      body {
        margin:0;
        font-family: Arial;
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:url('https://images.unsplash.com/photo-1513151233558-d860c5398176') no-repeat center/cover;
      }

      .overlay {
        position:absolute;
        width:100%;
        height:100%;
        background:rgba(15,23,42,0.75);
      }

      .container {
        position:relative;
        z-index:2;
        text-align:center;
        width:90%;
        max-width:420px;
        color:white;
      }

      .preview {
        border-radius:16px;
        overflow:hidden;
        margin-bottom:20px;
      }

      .preview img {
        width:100%;
        height:220px;
        object-fit:cover;
      }

      .preview-text {
        position:absolute;
        top:120px;
        left:50%;
        transform:translateX(-50%);
        color:white;
      }

      .box {
        background:#1e293b;
        padding:20px;
        border-radius:12px;
      }

      input, textarea, select {
        width:100%;
        padding:12px;
        margin:8px 0;
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
      }
    </style>
  </head>

  <body>

    <div class="overlay"></div>

    <div class="container">

      <h2>🎁 WishLoop</h2>

      <!-- PREVIEW -->
      <div class="preview">
        <img id="previewImage" src="https://images.unsplash.com/photo-1513151233558-d860c5398176">
        <div class="preview-text">
          <h3 id="previewTitle">Happy Birthday 🎉</h3>
          <p id="previewFrom">From: You</p>
        </div>
      </div>

      <!-- FORM -->
      <div class="box">
        <form action="/create" method="POST">

          <select name="festival" id="festival" onchange="updatePreview()">
            <option>Birthday</option>
            <option>Diwali</option>
            <option>Mother's Day</option>
          </select>

          <input name="from" id="from" placeholder="Your Name" oninput="updatePreview()" required />
          <input name="to" placeholder="Receiver Name" required />
          <textarea name="message" placeholder="Write your message"></textarea>

          <button>Create Surprise Link 🎁</button>

        </form>
      </div>

    </div>

    <script>
      const images = {
        "Birthday": "https://images.unsplash.com/photo-1513151233558-d860c5398176",
        "Diwali": "https://images.unsplash.com/photo-1607082350899-7e105aa886ae",
        "Mother's Day": "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
      };

      function updatePreview(){
        const fest = document.getElementById("festival").value;
        const from = document.getElementById("from").value || "You";

        document.getElementById("previewTitle").innerText = "Happy " + fest + " 🎉";
        document.getElementById("previewFrom").innerText = "From: " + from;
        document.getElementById("previewImage").src = images[fest];
      }
    </script>

  </body>
  </html>
  `);
});

  const link = "https://multitigo.com/w/" + id;

  res.send(`
  <html>
  <body style="text-align:center;background:#0f172a;color:white;padding:40px;">
    <h2>🎉 Your Surprise is Ready!</h2>

    <input value="${link}" style="width:80%;padding:10px"/>

    <br/><br/>

    <a href="https://wa.me/?text=${encodeURIComponent(`🎁 ${to}, you got a surprise from ${from}! 👉 ${link}`)}">
      <button style="padding:12px;background:#22c55e;">Share on WhatsApp</button>
    </a>

  </body>
  </html>
  `);
});

/* ===============================
   CARD VIEW (VIRAL EXPERIENCE)
================================ */
app.get("/w/:id", (req, res) => {

  const card = cards[req.params.id];
  if (!card) return res.send("Invalid link");

  card.views++;

  const index = card.views % images.length;
  const selectedImage = images[index];

  res.send(`
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:title" content="${card.from} sent you a surprise 🎁" />
    <meta property="og:description" content="${card.message}" />
    <meta property="og:image" content="${selectedImage}" />

    <style>
      body {
        margin:0;
        font-family:Arial;
        text-align:center;
        color:white;
        background:#000;
      }

      .overlay {
        position:fixed;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.4);
      }

      .container {
        position:relative;
        z-index:2;
        top:50%;
        transform:translateY(-50%);
      }

      .gift {
        font-size:80px;
        cursor:pointer;
        animation: bounce 1.5s infinite;
      }

      @keyframes bounce {
        0%{transform:translateY(0)}
        50%{transform:translateY(-15px)}
        100%{transform:translateY(0)}
      }

      .card {
        display:none;
      }

      .box {
        background:rgba(0,0,0,0.6);
        padding:20px;
        border-radius:12px;
        display:inline-block;
      }

    </style>
  </head>

  <body id="page">

    <div class="overlay"></div>

    <!-- STEP 1 -->
    <div class="container" id="step1">
      <h2>🎁 Hey ${card.to}!</h2>
      <p>You received a ${card.festival} Wish 💖</p>
      <p>👉 From: <b>${card.from}</b></p>
      <p>Tap the gift to open 🎁</p>
      <div class="gift" onclick="openGift()">🎁</div>
    </div>

    <!-- FINAL CARD -->
    <div class="container card" id="card">
      <h1>🎉 Happy ${card.festival} 🎉</h1>

      <img src="${selectedImage}" style="width:90%;max-width:400px;border-radius:15px"/>

      <div class="box">
        <p>${card.message}</p>
        <p><b>From: ${card.from}</b></p>
      </div>

      <br/>

      <a href="/wishloop">
        <button style="padding:12px;background:#22c55e;">Create Your Own</button>
      </a>
    </div>

    <script>
      function openGift(){
        document.getElementById("step1").style.display="none";
        document.getElementById("card").style.display="block";
        document.body.style.backgroundImage = "url('${selectedImage}')";
        document.body.style.backgroundSize = "cover";
      }
    </script>

  </body>
  </html>
  `);
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
