const express = require("express");
const { Pool } = require("pg");
const { encode, decode } = require("./base62");
const app = express();

const port = 6969;

const pool = new Pool({
  user: "postgres.ojxyxtrokqrsrpcccxog",
  host: "aws-1-ap-south-1.pooler.supabase.com",
  port: 6543,
  dbname: "postgres",
  password: "Urlshortener$123",
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Success: get request passed");
});

//Code for redirecting it to long_url
app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params;
  const id = decode(shortCode);

  try {
    const results = await pool.query(
      "SELECT original_url from url_mapping WHERE id=$1",
      id,
    );
    if (results.rows.length === 0) res.status(404).send("URL not found");
    const longUrl = results.rows[0].original_url;
    res.redirect(longUrl);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//Code for shortening the original_url
app.post("/shorten", async (req, res) => {
  const url = req.body.original_url;
  try {
    const result = await pool.query(
      "INSERT INTO url_mapping(original_url) VALUES($1) RETURNING id",
      [url],
    );
    const id = result.rows[0].id;

    // Encode ID -> Base62 short code
    const shortCode = encode(id);
    const shortUrl = `https://shorty-dusky.vercel.app/${shortCode}`;

    res.json({ shortUrl });
  } catch (err) {
    console.error("Error inserting URL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, (req, res) => {
  console.log(`App is listening in the port : ${port}`);
});
