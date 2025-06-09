import fetch from "node-fetch";
import  pkg from 'body-parser';
const { json, urlencoded } = pkg;
import express from 'express';
const app=express()
app.use(json())
app.use(express.static('./public'));
app.use(urlencoded({
    extended:true
}))
var seasonid;
var accountid;
const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzMWFlZDhjMC1iODNmLTAxM2MtNDc5Ni03NmU2MzczYTU0NTEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzA5MTA4MDE1LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Ii02OTU2NDMwZi1mN2E3LTRmOTktYWMwMS0wNDg1MzJjZjZlOTcifQ.XIRnPL62auBBU6YicL8UMHcMAoyX5dzGvDIdEx4GVMk";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/vnd.api+json",
  };
const seasonURl="https://api.pubg.com/shards/steam/seasons"
fetch(seasonURl, { headers })
        .then((res) => res.json())
        .then((json) => {
          const data = json.data;
          
            for (let j = 0; j < data.length; j++) {
             if (data[j].type === "season" && data[j].attributes.isCurrentSeason) {
                if(data[j].attributes.isCurrentSeason){
                    seasonid=data[j].id;
                    console.log("current season id:"+seasonid);
                };
             }
            }
        })
        .catch((err) => console.error("error during matchdatafetch:" + err));
var playerurl
var maxkilledgame;
var playerName;
var headshotkills
var dailykills 
var dailywins
var maxkillstreak 
var  top10
var predictedkd
app.set('view engine', 'ejs');  // set up ejs for templating
app.get( '/', async (req, res) => {
// return the index page
    res.render('index',{name:playerName,mode:maxkilledgame, kills:headshotkills,dailykills:dailykills,dailywins:dailywins,maxkillstreak:maxkillstreak,top10s:top10,Predictedkd:predictedkd});
})
app.post( '/',(req, res) =>{
    playerName = req.body.name;
    const accounturl = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`;
    fetch(accounturl, { headers })
    .then((res) => res.json())
    .then((json) => {
       accountid=json.data[0].id;
       console.log(accountid);
       playerurl=`https://api.pubg.com/shards/steam/players/${accountid}/seasons/${seasonid}`;
            fetch(playerurl, { headers })
              .then((res) => res.json())
              .then( async (json) => {
                try{
                let maxkill = 0;
                let maxkilledmode = null;
                for (const key in json.data.attributes.gameModeStats) {
                  const kills = json.data.attributes.gameModeStats[key].kills;
                  if (kills > maxkill) {
                    maxkill = kills;
                    maxkilledmode = key;
                  }
                }
                maxkilledgame= maxkilledmode;
                const maxkilledgamestats=json.data.attributes.gameModeStats[maxkilledmode];
                headshotkills=maxkilledgamestats.headshotKills
                dailykills=maxkilledgamestats.dailyKills
                dailywins=maxkilledgamestats.dailyWins
                maxkillstreak=maxkilledgamestats.maxKillStreaks
                top10=maxkilledgamestats.top10s
                runPythonScript();
              } catch(err){
                playerName="Error getting stats";
              }
            }
             )
    })
    .catch((err) => console.error("Error getting the player info:" + err));
  // Define the function you want to run after the delay
function delayedFunction() {
    res.redirect("/");
}

// Use setTimeout to delay the execution of the function
setTimeout(delayedFunction, 8000); // 2000 milliseconds = 2 seconds

       
    
})
import { spawn } from 'child_process';

// Function to run the Python script and supply input
function runPythonScript() {
 // Spawn a new child process to run the Python script
 const pythonProcess = spawn('python', ['./gkgni.py']);

 // Write input data to the stdin of the Python process
 pythonProcess.stdin.write(headshotkills + '\n' +dailykills + '\n' + dailywins + '\n' +maxkillstreak + '\n'+top10 + '\n'); // Ensure you send a newline character to simulate pressing Enter
 pythonProcess.stdin.end(); // End the input stream

 // Listen for data on stdout
 pythonProcess.stdout.on('data', (data) => {
   predictedkd=`${data.toString()}`
 });

 // Listen for errors from the Python process
 pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data.toString()}`);
 });

 // Listen for the close event to know when the Python process has finished
 pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
 });
}

// Example usage












app.listen(3012, () => {
    console.log("Server started on port 3012");
} )