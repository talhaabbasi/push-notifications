const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey = process.env.publicVapidKey;
const privateVapidKey = process.env.privateVapidKey;

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

app.post("/subscribe", (req, res, next) => {
  // Get push subscription object
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({ title: "Push test" });

  webpush.sendNotification(subscription, payload).catch((err) => {
    console.error(err);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
