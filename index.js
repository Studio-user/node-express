const url = 'https://www.youtube.com/watch?v=1FliVTcX8bQ';

const ytdl = require('ytdl-core');

const express = require('express');
const app = express();
const cors = require('cors');
const { response } = require('express');
const fs = require('fs');
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send('Hello')
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
        resolve('finish');
      })
    })
  }
  video(url).then(() => {
    setTimeout(() => {
      fs.rmSync(path1);
    });
  });
})

app.listen(3000)