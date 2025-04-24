const { google } = require("googleapis");
require("dotenv").config();

const writeToSheet = async (access_token, rows) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const sheets = google.sheets({ version: "v4", auth });

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.SHEET_NAME;

  const resource = {
    values: rows,
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: resource,
  });
};

module.exports = { writeToSheet };
