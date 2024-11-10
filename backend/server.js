const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ShortUrl = require("./models/ShortUrl");
const shortid = require("shortid");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// connect with MongoDB
mongoose.connect("mongodb://localhost/urlshortener", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// General route
app.get("/", (req, res) => {
  res.send("Добре дошли в URL Shortener! Сървърът работи.");
});

// API Route for shortening URL
app.post("/shorten", async (req, res) => {
  const { fullUrl } = req.body;
  const shortUrl = shortid.generate();

  const newUrl = new ShortUrl({
    fullUrl,
    shortUrl
  });

  try {
    await newUrl.save();
    res.json({ fullUrl, shortUrl });
  } catch (err) {
    res.status(500).json({ error: "Не може да се съкрати URL" });
  }
});

app.get("/shortened-urls", async (req, res) => {
    try {
      const urls = await ShortUrl.find();
      res.json(urls);
    } catch (err) {
      res.status(500).json({ error: "Не може да се заредят съкратените URL адреси" });
    }
  });

// redirect to original url
app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await ShortUrl.findOne({ shortUrl });

  if (url) {
    return res.redirect(url.fullUrl);
  } else {
    return res.status(404).json({ error: "URL не е намерен" });
  }
});

// route for deleting shortened url
app.delete("/shortened-urls/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
  
    try {
      const deletedUrl = await ShortUrl.findOneAndDelete({ shortUrl });
  
      if (deletedUrl) {
        res.status(200).json({ 
          message: `Съществуващият URL с кратък адрес ${shortUrl} беше успешно изтрит.`,
          deletedUrl: deletedUrl 
        });
      } else {
        res.status(404).json({ error: "Не беше намерен съкратен URL за изтриване." });
      }
    } catch (err) {
      res.status(500).json({ error: "Възникна грешка при изтриването на URL адреса." });
    }
  });
  
  // route for updating shortened url
app.put("/shortened-urls/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
    const { fullUrl, newShortUrl } = req.body; 
  
    try {
      const existingUrl = await ShortUrl.findOne({ shortUrl });
  
      if (!existingUrl) {
        return res.status(404).json({ error: "URL не е намерен" });
      }
  
      existingUrl.fullUrl = fullUrl || existingUrl.fullUrl; 
      if (newShortUrl) {
        existingUrl.shortUrl = newShortUrl; 
      }
  
      await existingUrl.save();
  
      res.status(200).json({
        message: "URL адресът беше успешно актуализиран",
        updatedUrl: existingUrl
      });
    } catch (err) {
      res.status(500).json({ error: "Възникна грешка при актуализирането на URL адреса." });
    }
  });
  



// Обслужване на статични файлове от build папката в frontend
const buildPath = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(buildPath));
console.log("Serving static files from:", buildPath);

// Връщане на index.html за всяка друга заявка
app.get("*", (req, res) => {
  console.log("Serving index.html for:", req.url);
  res.sendFile(path.join(buildPath, "index.html"));
});

// Стартиране на сървъра
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сървърът работи на порт ${PORT}`));
