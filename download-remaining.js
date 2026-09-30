const fs = require('fs');
const path = require('path');
const https = require('https');

const MEDIA_DIR = path.join(__dirname, 'public', 'media');
const list = JSON.parse(fs.readFileSync('public/media/amazon-images-list.json', 'utf8'));

function downloadFileWithTimeout(url, dest, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFileWithTimeout(res.headers.location, dest, timeoutMs).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      file.close();
      fs.unlink(dest, () => {});
      resolve(false);
    });
    req.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

(async () => {
  // Download vertical posters 5, 6
  const verticalCards = list.filter(item => item.src && item.src.includes('pv-target-images') && item.height === 414);
  for (let i = 4; i < Math.min(8, verticalCards.length); i++) {
    const dest = path.join(MEDIA_DIR, `poster-vertical-${i+1}.jpg`);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
      const ok = await downloadFileWithTimeout(verticalCards[i].src, dest);
      console.log(`Vertical poster ${i+1}: ${ok ? 'OK' : 'Failed'}`);
    }
  }

  // Download landscape cards
  const landscapeCards = list.filter(item => item.src && item.src.includes('pv-target-images') && item.height === 155);
  for (let i = 0; i < Math.min(8, landscapeCards.length); i++) {
    const dest = path.join(MEDIA_DIR, `card-landscape-${i+1}.jpg`);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
      const ok = await downloadFileWithTimeout(landscapeCards[i].src, dest);
      console.log(`Landscape card ${i+1}: ${ok ? 'OK' : 'Failed'}`);
    }
  }

  // Copy hero backdrop and logo to clean named files
  fs.copyFileSync(path.join(MEDIA_DIR, 'amazon-img-007.jpg'), path.join(MEDIA_DIR, 'hero-love-hypothesis.jpg'));
  fs.copyFileSync(path.join(MEDIA_DIR, 'amazon-img-008.png'), path.join(MEDIA_DIR, 'hero-logo-love-hypothesis.png'));
  fs.copyFileSync(path.join(MEDIA_DIR, 'amazon-img-001.png'), path.join(MEDIA_DIR, 'prime-video-logo.png'));

  console.log('Finished downloading remaining assets.');
})();
