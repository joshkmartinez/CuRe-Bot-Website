const express = require("express");
const app = express();
const { parse } = require("url");
const axios = require("axios");
require("dotenv").config();
const port = 3000;
app.use(express.urlencoded({ extended: false }));

app.get("/triggers", (req, res) => {
  const { query } = parse(req.url, true);
  const { guild = "000000000000000000" } = query;
  axios
    .get(process.env.storage_service + guild)
    .then(async function(response) {
      if (JSON.stringify(response.data) == "{}") {
        res.end("This server does not has not created any triggers.");
      }
      let list=[]
      //compose array of all triggers
      for (i = 0; i < Object.keys(response.data).length; i++) {
        let j = Object.keys(response.data)[i];
        list.push("Trigger:  " + j + "<br/>Response:  " + response.data[j]);
      }
      let ans = "";
      for (i = 0; i < list.length; i++) {
        ans += "Index: " + i + "<br/>" + list[i]+"<br/><br/>";
      }
      res.send(ans);
    })
    .catch(async function(error) {
      res.end("Error. A server with that ID does not exist.\n"+error);
    });
});

app.get("/invite", (req, res) => {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=592968118905733120&permissions=0&scope=bot"
  );
});

app.get("/server", (req, res) => {
  res.redirect(
    "https://discord.gg/EnQTzpB"
  );
});

app.get("/repo", (req, res) => {
  res.redirect(
    "https://github.com/joshkmartinez/cure-bot"
  );
});

app.get("/", (req, res) => {
  res.send("Hey check out this cool website for CuRe Bot!<br/>tdlr: CuRe Bot is a custom response bot for discord.<br/>I know, this website is just so amazing you have an unfathomable urge to invite the bot to your discord server.<br/>Well here is how you can satisfy your urge. Go to https://cure.now.sh/invite<br/><br/>Need help with the bot? Join the support server: https://cure.now.sh/server<br/>CuRe Bot is also open source! https://cure.now.sh/repo")
});

app.listen(port, () => {
  console.log(`Server is live on port 5000`);
});
