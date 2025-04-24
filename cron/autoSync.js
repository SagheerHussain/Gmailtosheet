const cron = require("node-cron");
const UserToken = require("../models/UserToken");
const {
  getAccessTokenFromRefresh,
  getUserInfo,
} = require("../services/googleAuthService");
const { getUnreadEmails } = require("../services/gmailService");
const { writeToSheet } = require("../utils/sheetService");

// Main sync function
const syncAllUsersToSheet = async () => {
  console.log("Auto Sync Started...");

  try {
    const users = await UserToken.find();

    for (const user of users) {
      try {
        const access_token = await getAccessTokenFromRefresh(
          user.refresh_token
        );
        const emails = await getUnreadEmails(access_token);

        if (emails.length === 0) continue;

        const rows = emails.map((email) => [
          user.email,
          email.from,
          email.subject,
        ]);

        await writeToSheet(access_token, rows);
        console.log(`Synced for ${user.email}`);
      } catch (err) {
        console.error(`Failed for ${user.email}:`, err.message);
      }
    }

    console.log("Auto Sync Completed");
  } catch (err) {
    console.error("Error in syncAllUsersToSheet:", err.message);
  }
};

// ⏱ Schedule to run every 10 seconds
const startCronJob = () => {
  cron.schedule("*/20 * * * * *", syncAllUsersToSheet); // every 10 seconds
  console.log("Cron Job Scheduled (every 10 seconds)");
};

module.exports = startCronJob;
