const express = require("express");
const { encode, validate, decode } = require("./utils");
const port = 3000;

const app = express();
// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Encode endpoint
app.post("/encode", (req, res) => {
  try {
    const message = req.body.message;
    if (!message) {
      throw new Error("Message is required.");
    }
    const codeword = encode(message);
    res.json({ codeword: codeword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Validate endpoint
app.post("/validate", (req, res) => {
  try {
    const codeword = req.body.codeword;
    if (!codeword) {
      throw new Error("Codeword is required.");
    }
    const result = validate(codeword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Decode endpoint
app.post("/decode", (req, res) => {
  try {
    const codeword = req.body.codeword;
    if (!codeword) {
      throw new Error("Codeword is required.");
    }
    const result = decode(codeword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
