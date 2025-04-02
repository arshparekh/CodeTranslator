import express from "express";
import axios from "axios";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK (with Firestore)
const serviceAccount = require("./path-to-your-service-account-key.json"); // From Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore instance

// Middleware to Verify Firebase Token
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Auth Endpoint to Sync User with Firestore
app.post("/api/auth", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Check if user exists in Firestore, create if not
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.json({ message: "User authenticated", uid, email });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Your Existing Endpoints (Protected with Authentication)
const GEMINI_API_KEY = ""; // Replace with your Gemini API key

app.post("/api/convert", authenticateToken, async (req, res) => {
  try {
    const { inputCode, fromLanguage, toLanguage } = req.body;
    const prompt = `Convert the following ${fromLanguage} code to ${toLanguage}, no explanation\n${inputCode}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const convertedCode = response.data.candidates[0].content.parts[0].text;
    // Optionally save the conversion to Firestore
    await db.collection("conversions").add({
      uid: req.user.uid,
      inputCode,
      fromLanguage,
      toLanguage,
      convertedCode,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ convertedCode });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

app.post("/api/debug", authenticateToken, async (req, res) => {
  try {
    const { inputCode, language } = req.body;
    const prompt = `Debug the following ${language} code\n${inputCode}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const debugResult = response.data.candidates[0].content.parts[0].text;
    // Optionally save the debug result
    await db.collection("debugs").add({
      uid: req.user.uid,
      inputCode,
      language,
      debugResult,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ debugResult });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Debugging failed" });
  }
});

app.post("/api/evaluate", authenticateToken, async (req, res) => {
  try {
    const { inputCode, language } = req.body;
    const prompt = `Evaluate the time and space complexity of the following with a short explanation:\n${inputCode}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const evaluationResult = response.data.candidates[0].content.parts[0].text;
    // Optionally save the evaluation
    await db.collection("evaluations").add({
      uid: req.user.uid,
      inputCode,
      language,
      evaluationResult,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ evaluationResult });
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});