const request = require("request");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  request(
    {
      method: "POST",
      url: "https://slack.com/api/emoji.list",
      form: {
        token: process.env.TOKEN
      }
    },
    (error, response, body) => {
      if (response.statusCode === 200) {
        try {
          const json = JSON.parse(body);
          if (json.ok) {
            res.json(json.emoji);
          } else {
            console.error("error from slack", json.error);
            res.status(500).end();
          }
        } catch (e) {
          console.error(e.message);
          res.status(500).end();
        }
      } else {
        console.error("non 200 reponse status code", response.statusCode);
        res.status(500).end();
      }
    }
  ).on("error", e => {
    console.error("request error", e);
    res.status(500).end();
  });
});

app.listen(3000);
