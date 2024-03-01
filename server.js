const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors()); 

app.get('/video-info', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    // Input validation
    if (!videoUrl) {
      throw new Error('Missing "url" query parameter');
    }

    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid YouTube video URL');
    }

    const videoInfo = await ytdl.getInfo(videoUrl);

    // Filter formats to include video and audio streams
    const videoAndAudioFormats = videoInfo.formats.filter(format => format.hasVideo && format.hasAudio);

    // Get the best quality video with audio
    const videoWithAudio = ytdl.chooseFormat(videoAndAudioFormats, { quality: 'highestvideo' }).url;

    // Filter formats to include only audio streams
    const audioOnlyFormats = videoInfo.formats.filter(format => !format.hasVideo && format.hasAudio);

    // Get the best quality audio
    const bestAudioOnly = ytdl.chooseFormat(audioOnlyFormats, { quality: 'highestaudio' }).url;

    // Customize the response data 
    const filteredInfo = {
      title: videoInfo.videoDetails.title,
      lengthSeconds: videoInfo.videoDetails.lengthSeconds,
      thumbnail: videoInfo.videoDetails.thumbnails[0].url,
      videoWithAudio,
      bestAudioOnly,
    };

    res.json(filteredInfo);

  } catch (error) {
    console.error('Error fetching video information:', error.message);
    res.status(500).json({ error: 'Error fetching video information' });
  }
});

app.get('/downloadvideo', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    // Input validation
    if (!videoUrl) {
      throw new Error('Missing "url" query parameter');
    }

    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid YouTube video URL');
    }

    const videoInfo = await ytdl.getInfo(videoUrl);

    // Filter formats with video and audio
    const videoAndAudioFormats = videoInfo.formats.filter(format => format.hasVideo && format.hasAudio);

    // Function to find the best format based on bitrate
    const findBestFormat = formats => {
        return formats.reduce((bestFormat, currentFormat) => {
            // Check if it's the first format or if the current format has higher bitrate
            if (!bestFormat || currentFormat.bitrate > bestFormat.bitrate) {
                return currentFormat;
            }
            return bestFormat;
        }, null);
    };

    // Find the best video format
    const bestVideoFormat = findBestFormat(videoAndAudioFormats);

    if (!bestVideoFormat) {
      throw new Error('No video format found');
    }

    // Set the response headers
    res.header('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.${bestVideoFormat.container}"`);
    res.header('Content-Type', bestVideoFormat.mimeType);

    // Pipe the video to the response
    ytdl(videoUrl, { format: bestVideoFormat }).pipe(res);

  } catch (error) {
    console.error('Error downloading video:', error.message);
    res.status(500).json({ error: 'Error downloading video' });
  }
});

app.get('/downloadaudio', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    // Input validation
    if (!videoUrl) {
      throw new Error('Missing "url" query parameter');
    }

    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid YouTube video URL');
    }

    const videoInfo = await ytdl.getInfo(videoUrl);

    // Filter formats with only audio
    const audioOnlyFormats = videoInfo.formats.filter(format => !format.hasVideo && format.hasAudio);

    // Function to find the best format based on bitrate
    const findBestFormat = formats => {
        return formats.reduce((bestFormat, currentFormat) => {
            // Check if it's the first format or if the current format has higher bitrate
            if (!bestFormat || currentFormat.bitrate > bestFormat.bitrate) {
                return currentFormat;
            }
            return bestFormat;
        }, null);
    };

    // Find the best audio format
    const bestAudioFormat = findBestFormat(audioOnlyFormats);

    if (!bestAudioFormat) {
      throw new Error('No audio format found');
    }

    // Set the response headers
    res.header('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.${bestAudioFormat.container}"`);
    res.header('Content-Type', bestAudioFormat.mimeType);

    // Pipe the audio to the response
    ytdl(videoUrl, { format: bestAudioFormat }).pipe(res);

  } catch (error) {
    console.error('Error downloading audio:', error.message);
    res.status(500).json({ error: 'Error downloading audio' });
  }
});


app.listen(80, () => {
  console.log('Server listening on port 80');
});
