const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const MEDIA_DIR = path.join(__dirname, 'public', 'media');
const list = JSON.parse(fs.readFileSync('public/media/amazon-images-list.json', 'utf8'));

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'Referer': 'https://www.amazon.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(res.statusCode); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

(async () => {
  // 1. Download vertical posters (Row 3: Featured Originals 276x414)
  const verticalCards = list.filter(item => item.src && item.src.includes('pv-target-images') && item.height === 414);
  console.log(`Found ${verticalCards.length} vertical posters`);
  for (let i = 0; i < Math.min(12, verticalCards.length); i++) {
    const dest = path.join(MEDIA_DIR, `poster-vertical-${i+1}.jpg`);
    await downloadFile(verticalCards[i].src, dest);
    console.log(`Downloaded poster-vertical-${i+1}.jpg`);
  }

  // 2. Download landscape cards (276x155 for Popular now)
  const landscapeCards = list.filter(item => item.src && item.src.includes('pv-target-images') && item.height === 155);
  console.log(`Found ${landscapeCards.length} landscape cards`);
  for (let i = 0; i < Math.min(12, landscapeCards.length); i++) {
    const dest = path.join(MEDIA_DIR, `card-landscape-${i+1}.jpg`);
    await downloadFile(landscapeCards[i].src, dest);
    console.log(`Downloaded card-landscape-${i+1}.jpg`);
  }

  // 3. Download channel cards (Live TV 624x351)
  const channelCards = list.filter(item => item.src && item.src.includes('pv-target-images') && item.height === 351);
  console.log(`Found ${channelCards.length} channel cards`);
  for (let i = 0; i < Math.min(8, channelCards.length); i++) {
    const dest = path.join(MEDIA_DIR, `card-channel-${i+1}.jpg`);
    await downloadFile(channelCards[i].src, dest);
    console.log(`Downloaded card-channel-${i+1}.jpg`);
  }

  console.log('All cards downloaded successfully!');
})();
