const express = require("express");
const router = express.Router();
const {
  getGoogleAuthURL,
  getTokensFromCode,
  getUserInfo,
} = require("../services/googleAuthService");

const { getUnreadEmails } = require("../services/gmailService");
const { writeToSheet } = require("../utils/sheetService");
const UserToken = require("../models/UserToken");

router.get("/google", (req, res) => {
  const url = getGoogleAuthURL();
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const tokens = await getTokensFromCode(code);
    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;

    // ✅ Get user email
    const user = await getUserInfo(access_token);

    // ✅ Save to MongoDB (if not already exists)
    const existing = await UserToken.findOne({ email: user.email });
    if (!existing && refresh_token) {
      await UserToken.create({
        email: user.email,
        refresh_token,
      });
    }

    // ✅ Fetch unread emails
    const emails = await getUnreadEmails(access_token);

    // ✅ Prepare rows for sheet
    const rows = emails.map((email) => [user.email, email.from, email.subject]);

    // ✅ Write to Google Sheet
    await writeToSheet(access_token, rows);

    res.send("✅ Email sync complete. You can close this tab.");
  } catch (err) {
    console.error("❌ Error during /callback:", err); // ⬅ Show full error
    res.status(500).send("Something went wrong: " + err.message);
  }
});

module.exports = router;
