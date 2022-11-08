const panaceaSender = async ({ to, text }) => {
  const params = {
    action: "message_send",
    username: process.env.P_USERNAME,
    password: process.env.P_PASSWORD,
    text: text,
    to: to,
    from: "Fire A",
  };

  const mURL = `https://api.panaceamobile.com/json`;
  const response = await axios.get(mURL, { params });

  return { response, messageData: params };
};

module.exports = panaceaSender;
