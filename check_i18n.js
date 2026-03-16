const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const localesDir = path.join(srcDir, 'locales');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const keys = new Set();
const regex = /t\(['"](dashboards\.[^'"]+)['"]\)/g;
const regex2 = /t\(['"](dashboards\.[^'"]+)['"](?:,[^)])?\)/g;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  while ((match = regex2.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

const checkTranslation = (lang) => {
  const p = path.join(localesDir, lang, 'translation.json');
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  const missing = [];

  keys.forEach(k => {
    const parts = k.split('.');
    let curr = obj;
    let found = true;
    for (let part of parts) {
      if (curr && curr[part]) {
        curr = curr[part];
      } else {
        found = false;
        break;
      }
    }
    if (!found) {
      missing.push(k);
    }
  });

  console.log(`\n=== Missing in ${lang} ===`);
  missing.forEach(m => console.log(m));
};

checkTranslation('es');
checkTranslation('en');
checkTranslation('ca');
