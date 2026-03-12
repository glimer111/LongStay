const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images');
const iconsDir = path.join(root, 'public', 'icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const ICON_FILES = [
  'arrow-circle-right 1.png',
  'clock-three (1) 1.png',
  'coins 1.png',
  'cross 1.png',
  'Frame 1281 1.png',
  'instagram 1.png',
  'search (1) 1.png',
  'search (1) 2.png',
  'telegram 1.png',
  'tik-tok 1.png',
];

const ICON_RENAMES = {
  'arrow-circle-right 1.png': 'arrow-circle-right.png',
  'clock-three (1) 1.png': 'clock-three.png',
  'coins 1.png': 'coins.png',
  'cross 1.png': 'cross.png',
  'Frame 1281 1.png': 'logo.png',
  'instagram 1.png': 'instagram.png',
  'search (1) 1.png': 'search.png',
  'search (1) 2.png': 'search-input.png',
  'telegram 1.png': 'telegram.png',
  'tik-tok 1.png': 'tiktok.png',
};

const IMAGE_RENAMES = {
  '4253708 1.png': 'hero.png',
  'nick-night-Q8pIgNnQuv0-unsplash 4.png': 'hero-left.png',
  'nick-night-Q8pIgNnQuv0-unsplash 5.png': 'hero-right.png',
  'yuri-krupenin-F0HkrKeciYs-unsplash 4.png': 'article-1.png',
  'yuri-krupenin-F0HkrKeciYs-unsplash 5.png': 'article-2.png',
  'yuri-krupenin-F0HkrKeciYs-unsplash 6.png': 'article-3.png',
  'yuri-krupenin-F0HkrKeciYs-unsplash 7.png': 'article-4.png',
};

// Move icons
ICON_FILES.forEach((oldName) => {
  const src = path.join(imagesDir, oldName);
  const newName = ICON_RENAMES[oldName] || oldName;
  const dest = path.join(iconsDir, newName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    console.log('Moved icon:', oldName, '->', newName);
  }
});

// Rename images (stay in images folder)
Object.entries(IMAGE_RENAMES).forEach(([oldName, newName]) => {
  const src = path.join(imagesDir, oldName);
  const dest = path.join(imagesDir, newName);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log('Renamed image:', oldName, '->', newName);
  }
});

console.log('Done.');
