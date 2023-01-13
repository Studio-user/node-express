const url = 'https://www.youtube.com/watch?v=1FliVTcX8bQ';

const ytdl = require('ytdl-core');

const express = require('express');
const app = express();
const cors = require('cors');
const { response } = require('express');
const fs = require('fs');
const path = require('path');
const { encode } = require('punycode');
const { resolve } = require('dns');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send(`Hello. It is for downloading musics.`);
})

app.get('/title', (req, res) => {
  const url = req.query.url;
  let mp3Title = '';
  const title = async function(url) {
    await new Promise((resolve) => {
      ytdl.getInfo(url)
      .then(data => {
        mp3Title = encodeURI(data.videoDetails.title);
        res.send(JSON.stringify({
          Title: mp3Title
        }));
        setTimeout(() => {
          resolve();
        }, 2000);
      })
    })
  }
  title(url)
})

app.get('/download', (req, res) => {
  const url = req.query.url;
  const path1 = __dirname + '/video.mp3';  
  const video = async function(url) {
    await new Promise((resolve) => {
      ytdl(url, {filter:'audioonly'})
      .pipe(fs.createWriteStream('video.mp3'))
      .on('close', () => {
        res.sendFile(path1);
        setTimeout(() => {
          resolve();
        }, 2000)
      })
    })
  }
  video(url).then(() => {
    let OK = true;
    setTimeout(() => {
      while(OK) {
        console.log('aa')
        if(fs.existsSync(path1)){
          fs.rmSync(path1);
          console.log('bb')
          OK = false;
          break;
        }
        break;
      }
    }, 2000)
  })
})

app.get('*', (req, res) => {
  res.send('What do you want?');
})

app.listen(3000)