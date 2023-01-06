const url = 'https://www.youtube.com/watch?v=1FliVTcX8bQ';

const ytdl = require('ytdl-core');
const Qualities = [
  'AUDIO_QUALITY_MEDIUM',
  'AUDIO_QUALITY_LOW',
]

const express = require('express');
const app = express();
const cors = require('cors');
const { response } = require('express');
const fs = require('fs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/download', (req, res) => {
  setTimeout(() => {
    fs.readFile(__dirname+'/video.mp3', (err ,data) => {
      res.writeHead(200, {'Content-Type': 'audio/mp3'});
      res.write(data);
      res.end();
    })
  }, 15000);
    
  ytdl(url, {filter:'audioonly'}).pipe(fs.createWriteStream('video.mp3'))

})

app.listen(3000)