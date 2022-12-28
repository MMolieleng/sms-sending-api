import axios from "axios";

const panaceaSender = async (to, text, reportUrl, mask) => {
  const params = {
    action: "message_send",
    username: process.env.P_USERNAME,
    password: process.env.P_PASSWORD,
    text: text,
    to: to,
    from: "Fire SMS",
    report_url: reportUrl,
    report_mask: mask,
  };

  const mURL = `https://api.panaceamobile.com/json`;
  const response = await axios.get(mURL, { params });
  const data = response.data;

  return { data };
};


/**
 * Checks the cost of sending a message to a particular number
 * @param {string} toPhoneNumber 
 */
const routePrice = async (toPhoneNumber) => {
  const params = {
    action: "route_check_price",
    username: process.env.P_USERNAME,
    password: process.env.P_PASSWORD,
    to: toPhoneNumber
  };
  const mURL = `https://api.panaceamobile.com/json`;
  const response = await axios.get(mURL, { params });
  const { data } = response
  const { status, message, details: { cost, reason } } = data
  return { status, message, cost, reason };
}

export default { panaceaSender, routePrice };
