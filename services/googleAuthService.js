const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const getGoogleAuthURL = () => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/spreadsheets",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

const getTokensFromCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const getAccessTokenFromRefresh = async (refresh_token) => {
  oauth2Client.setCredentials({ refresh_token });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials.access_token;
};

const getUserInfo = async (access_token) => {
  oauth2Client.setCredentials({ access_token });
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const res = await oauth2.userinfo.get();
  return res.data;
};

module.exports = {
  getGoogleAuthURL,
  getTokensFromCode,
  getAccessTokenFromRefresh,
  getUserInfo,
  oauth2Client,
};
