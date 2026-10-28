// scripts/sync-assets.js
// Automatically syncs index.html, manifest.json, service-worker.js, and icons across all mirrors and the mobile webDir

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targets = [
  path.join(rootDir, 'frontend'),
  path.join(rootDir, 'backend', 'public'),
  path.join(rootDir, 'backend'),
  path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'public')
];

const filesToSync = [
  'index.html',
  'manifest.json',
  'service-worker.js'
];

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

// Ensure icons exist in targets
targets.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy files
  filesToSync.forEach(file => {
    const src = path.join(rootDir, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Synced ${file} -> ${path.relative(rootDir, dest)}`);
    }
  });

  // Copy icons directory
  const srcIcons = path.join(rootDir, 'icons');
  const destIcons = path.join(targetDir, 'icons');
  if (fs.existsSync(srcIcons)) {
    copyFolderRecursiveSync(srcIcons, destIcons);
    console.log(`Synced icons/ -> ${path.relative(rootDir, destIcons)}`);
  }
});

console.log('All SafeCity mobile and web assets synchronized successfully.');
