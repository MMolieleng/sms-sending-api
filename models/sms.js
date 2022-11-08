const { model, Schema } = require("mongoose");

const smsReport = new Schema({
  to: {
    type: String,
  },
  message: {
    type: String,
  },
});

const smsMessage = new Schema(
  {
    to: {
      type: String,
    },
    text: {
      type: String,
    },
    from: {
      type: String,
    },
    reportUrl: {
      type: String,
    },
    reportMask: {
      type: Number,
    },
    messageStatus: {},
    messageId: {
      type: String,
    },
    report: {
      type: smsReport,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const SMSMessage = model("smsMessage", smsMessage);

module.exports = SMSMessage;
