const express = require("express");
const app = express();

// ✅ Middleware (IMPORTANT)
app.use(express.urlencoded({ extended: true }));

// ✅ Temporary storage (in-memory)
const db = {};

// =====================================
// 🎁 ROUTE 1: FORM PAGE
// =====================================
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
        background:rgba(15,23,42,0.6);
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
        position:relative;
      }

      .preview img {
        width:100%;
        height:220px;
        object-fit:cover;
      }

      .preview-text {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
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

      <div class="preview">
        <img id="previewImage" src="https://images.unsplash.com/photo-1513151233558-d860c5398176">
        <div class="preview-text">
          <h3 id="previewTitle">Happy Birthday 🎉</h3>
          <p id="previewFrom">From: You</p>
        </div>
      </div>

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

// =====================================
// 🎯 ROUTE 2: CREATE LINK
// =====================================
app.post("/create", (req, res) => {

  const { from, to, message, festival } = req.body;

  const id = Date.now().toString().slice(-6); // short id

  // save data
  db[id] = { from, to, message, festival };

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

// =====================================
// 🔗 ROUTE 3: OPEN CARD
// =====================================
app.get("/w/:id", (req, res) => {

  const data = db[req.params.id];

  if (!data) return res.send("Invalid link");

  res.send(`
  <html>
  <body style="text-align:center;background:#0f172a;color:white;padding:40px;">
    <h1>🎉 Happy ${data.festival} ${data.to}!</h1>
    <h3>From: ${data.from}</h3>
    <p>${data.message}</p>
  </body>
  </html>
  `);

});

// =====================================
// 🚀 SERVER START
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
