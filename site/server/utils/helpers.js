/* eslint-disable prefer-destructuring */
const fs = require('fs');
const path = require('path');

const getMimeType = (ext) => {
  let mimeType = 'text/plain';
  switch (ext) {
    case 'css':
      mimeType = 'text/css';
      break;
    case 'js':
      mimeType = 'text/javascript';
      break;
    case 'html':
      mimeType = 'text/html';
      break;
    case 'json':
      mimeType = 'application/json';
      break;
    default:
      mimeType = 'text/plain';
  }
  return mimeType;
};

const recursiveFindFile = (dir, subject, options = {}, parentDir = null, foundFiles = []) => {
  const list = fs.readdirSync(dir);
  list.forEach((item) => {
    const newDir = path.resolve(dir, item);
    if (fs.statSync(newDir).isDirectory()) {
      recursiveFindFile(newDir, subject, options, item, foundFiles);
    } else {
      if (typeof options.parentDir !== 'undefined') {
        if (options.parentDir !== parentDir) {
          return;
        }
      }
      const fileName = newDir.split(path.sep).pop();
      if (fileName.match(subject)) {
        foundFiles.push({
          fileName,
          parentDir,
          subject,
          url: newDir,
        });
      }
    }
  });
  return foundFiles;
};

const getLanguageFromHeaders = (langsLine, acceptedLangs) => {
  let lang = null;
  if (langsLine) {
    langsLine.split(';').some((langLine) => {
      lang = acceptedLangs.filter((l) => { return langLine.toLowerCase().match(l); });
      if (lang.length > 0) {
        lang = lang[0];
      }
      return lang;
    });
  }
  return lang;
};

module.exports = {
  getLanguageFromHeaders,
  recursiveFindFile,
  getMimeType,
};
