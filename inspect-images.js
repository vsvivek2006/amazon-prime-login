const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync('public/media/amazon-images-list.json', 'utf8'));
const hero = list.filter(i => i.src && i.src.length > 50 && (i.src.includes('m.media-amazon.com') || i.src.includes('images-na'))).slice(0, 30);

const results = hero.map((img, i) => {
  const ext = img.src.includes('FMpng') || img.src.endsWith('.png') ? 'png' : 'jpg';
  const filename = `amazon-img-${String(i).padStart(3, '0')}.${ext}`;
  const filePath = path.join('public', 'media', filename);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  return {
    index: i,
    filename,
    sizeKb: Math.round(size / 1024),
    alt: img.alt || '(no alt)',
    width: img.width,
    height: img.height,
    src: img.src
  };
});

fs.writeFileSync('public/media/downloaded-summary.json', JSON.stringify(results, null, 2));
console.log('Summary written to public/media/downloaded-summary.json');
console.table(results.map(r => ({ filename: r.filename, sizeKb: r.sizeKb, alt: r.alt, dims: `${r.width}x${r.height}` })));
