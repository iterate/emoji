const request = require("request");
const express = require("express");

const app = express();

const json = () =>
  new Promise((resolve, reject) =>
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
              resolve(json.emoji);
            } else {
              console.error("error from slack", json.error);
              reject();
            }
          } catch (e) {
            console.error(e.message);
            reject();
          }
        } else {
          console.error("non 200 reponse status code", response.statusCode);
          reject();
        }
      }
    ).on("error", e => {
      console.error("request error", e);
      reject();
    })
  );

const html = () =>
  new Promise((resolve, reject) =>
    json()
      .then(emojis =>
        resolve(
          Object.keys(emojis)
            .map(
              emoji =>
                `<div>${emoji}: ${emojis[emoji].startsWith("alias:")
                  ? emojis[emoji]
                  : `<img src="${emojis[emoji]}" alt="${emoji}"/>`}</div>`
            )
            .join("")
        )
      )
      .catch(reject)
  );

app.get("/", (req, res) => {
  res.format({
    "text/html": () =>
      html().then(html => res.send(html)).catch(() => res.status(500).end()),
    default: () =>
      json().then(json => res.json(json)).catch(() => res.status(500).end())
  });
});

app.listen(3000);
