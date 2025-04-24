const { google } = require("googleapis");

const getUnreadEmails = async (access_token) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread",
    maxResults: 5,
  });

  const messages = res.data.messages || [];
  const results = [];

  for (const msg of messages) {
    const msgDetail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const headers = msgDetail.data.payload.headers;
    const from = headers.find((h) => h.name === "From")?.value || "Unknown";
    const subject =
      headers.find((h) => h.name === "Subject")?.value || "No Subject";

    results.push({ from, subject });

    // ✅ Mark email as read
    await gmail.users.messages.modify({
      userId: "me",
      id: msg.id,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
  }

  return results;
};

module.exports = { getUnreadEmails };
