const express = require("express");
const app = express();
const { parse } = require("url");
const axios = require("axios");
require("dotenv").config();

const port = 3000;

// Body parser
app.use(express.urlencoded({ extended: false }));

app.get("/triggers", (req, res) => {
  const { query } = parse(req.url, true);

  const { guild = "000000000000000000" } = query;
  axios
    .get(process.env.storage_service + guild)
    .then(async function(response) {
      if (JSON.stringify(response.data) == "{}") {
        //no triggers set up
        res.end("This server does not has not created any triggers.");
      }
      let list=[]
      //compose array of all triggers
      for (i = 0; i < Object.keys(response.data).length; i++) {
        let j = Object.keys(response.data)[i];

        //list.push("TRIGGER:  " + j + "   ~   RESPONSE:  " + response.data[j]);
        list.push("TRIGGER:  " + j + "\nRESPONSE:  " + response.data[j]);
      }
      let ans = "";
      for (i = 0; i < list.length; i++) {
        ans += "Index: " + i + "\n" + list[i]+"\n\n";
      }
      res.end(ans);
    })
    .catch(async function(error) {
      res.end("Error. This server does not exist.\n"+error);
    });
});

app.get("/invite", (req, res) => {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=592968118905733120&permissions=0&scope=bot"
  );
});

app.get("/", (req, res) => {
  res.end("Hey check out this cool website for CuRe Bot!\nI know, this website is just so amazing you have an unfathomable urge to invite the bot to your discord server.\nWell here is how you can satisfy your urge. Go to https://cure.now.sh/invite")
});

app.listen(port, () => {
  console.log(`Server is live on port 5000`);
});
