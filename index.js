"use strict";
const fs = require('fs');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_id3_1 = __importDefault(require("node-id3"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const exceptions_1 = require("ytdl-mp3/build/exceptions");
const utils_1 = require("ytdl-mp3/build/utils");
const convertVideoToAudio_1 = __importDefault(require("ytdl-mp3/build/convertVideoToAudio"));
const downloadVideo_1 = __importDefault(require("ytdl-mp3/build/downloadVideo"));
const extractSongTags_1 = __importDefault(require("ytdl-mp3/build/extractSongTags"));
const getFilepaths_1 = __importDefault(require("ytdl-mp3/build/getFilepaths"));
function downloadSong(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((options === null || options === void 0 ? void 0 : options.outputDir) && !(0, utils_1.isDirectory)(options.outputDir)) {
            throw new exceptions_1.NotADirectoryError(options.outputDir);
        }
        const videoInfo = yield ytdl_core_1.default.getInfo(url).catch(() => {
            throw new exceptions_1.VideoInfoFetchError('Unable to fetch info for video with URL: ' + url);
        });
        const filepaths = (0, getFilepaths_1.default)(videoInfo.videoDetails.title, (options === null || options === void 0 ? void 0 : options.outputDir) || (0, utils_1.getDownloadsDir)());
        yield (0, downloadVideo_1.default)(videoInfo, filepaths.videoFile);
        (0, convertVideoToAudio_1.default)(filepaths.videoFile, filepaths.audioFile);
        if (options === null || options === void 0 ? void 0 : options.getTags) {
            const songTags = yield (0, extractSongTags_1.default)(videoInfo, options.verifyTags);
            node_id3_1.default.write(songTags, filepaths.audioFile);
        }
        return filepaths.audioFile;
    });
}






const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hi');
})

app.get('/download', (req, res) => {
  const clientUrl = req.query.url;

  downloadSong(clientUrl, {
    outputDir: __dirname,
  }).then(data => {
    setTimeout(() => {
      fs.rmSync(data);
    }, 1000);
    res.sendFile(data);
  });
})

app.listen(3000);
