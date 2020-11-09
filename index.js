const express = require("express");
const app = express();
const { parse } = require("url");
const axios = require("axios");
const marked = require("marked");
require("dotenv").config();
const port = 3000;
app.use(express.urlencoded({ extended: false }));

const analytics = `<script data-goatcounter="https://cure.goatcounter.com/count"
async src="//gc.zgo.at/count.js"></script>`;

const styles = `<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">`;

const captcha =
  '<script src="https://hcaptcha.com/1/api.js" async defer></script>';

app.get("/triggers", (req, res) => {
  const { query } = parse(req.url, true);
  const { guild = "000000000000000000" } = query;
  axios
    .get(process.env.storage_service + guild)
    .then(async function (response) {
      let list = [];
      //compose array of all triggers
      for (i = 0; i < Object.keys(response.data).length; i++) {
        let j = Object.keys(response.data)[i];
        list.push("Trigger:  " + j + "<br/>Response:  " + response.data[j]);
      }
      let ans = "";
      for (i = 0; i < list.length; i++) {
        ans += "<b>Index: " + i + "</b><br/>" + list[i] + "<br/><br/>";
      }
      res.send(
        analytics +
          styles +
          captcha +
          '<div class="h-captcha" data-sitekey="10c0694e-6e03-4851-b19a-92025eb2d72c"></div>' +
          ans
      );
    })
    .catch(async function (error) {
      res.send(
        analytics +
          styles +
          error +
          marked(
            "### A server with that ID does not exist.<br/>Create a trigger with the `?create` command to see it here."
          )
      );
    });
});

app.get("/invite", (req, res) => {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=592968118905733120&permissions=0&scope=bot"
  );
});

app.get("/server", (req, res) => {
  res.redirect("https://discord.gg/EnQTzpB");
});

app.get("/repo", (req, res) => {
  res.redirect("https://github.com/joshkmartinez/cure-bot");
});

app.get("/", (req, res) => {
  axios
    .get(
      "https://raw.githubusercontent.com/joshkmartinez/CuRe-Bot/master/README.md"
    )
    .then(async function (response) {
      res.send(analytics + styles + marked(response.data));
    })
    .catch(async function (error) {
      res.send(
        analytics + styles + error + "<b/>Error. Please refresh the page."
      );
    });
});

app.listen(port, () => {
  console.log(`Server is live on port 3000`);
});
