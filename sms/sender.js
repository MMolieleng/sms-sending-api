const axios = require("axios");

const panaceaSender = async (to, text, reportUrl, mask) => {
  const params = {
    action: "message_send",
    username: process.env.P_USERNAME,
    password: process.env.P_PASSWORD,
    text: text,
    to: to,
    from: "Fire A",
    report_url: reportUrl,
    report_mask: mask,
  };

  const mURL = `https://api.panaceamobile.com/json`;
  const response = await axios.get(mURL, { params });

  return { response, messageData: params };
};

module.exports = panaceaSender;
