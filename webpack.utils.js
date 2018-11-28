/* eslint-disable
  no-param-reassign,
  prefer-destructuring,
  no-restricted-syntax,
  no-extra-boolean-cast,
  no-bitwise
*/
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const fse = require('fs-extra');
const jsonminify = require('jsonminify');
const helpers = require('./site/client/utils/helpers');
const constants = require('./site/client/components/App/constants');

const cache = {};

const setChunksHashesToManifest = (compilation, manifest) => {
  try {
    compilation.chunks.forEach((chunk) => {
      const assetName = chunk.name.split('/').pop();
      let jsHash = '';
      let cssHash = '';
      for (const hashKey in chunk.contentHash) {
        if (!!~hashKey.indexOf('mini-css-extract-plugin')) {
          cssHash = chunk.contentHash[hashKey];
        } else if (hashKey === 'javascript') {
          jsHash = chunk.contentHash[hashKey];
        }
      }
      manifest[`${assetName}.js`] = jsHash;
      if (
        assetName !== 'vendors'
        && assetName !== 'common'
      ) {
        manifest[`${assetName}.css`] = cssHash;
      }
    });
    return manifest;
  } catch (err) {
    console.log('moveHashesFromAssetsToManifest error: ', err);
    return manifest;
  }
};

const buildI18nFiles = (files, manifest) => {
  try {
    files.forEach((file) => {
      const pageName = file.url.split(path.sep).filter((elem, index, arr) => {
        return index === arr.length - 3;
      })[0].split('Page')[0].toLowerCase();
      if (typeof manifest.i18n === 'undefined') {
        manifest.i18n = {};
      }

      const lang = file.fileName.split('.')[0].toString().toLowerCase();
      const cacheKey = `${pageName}.${file.fileName}`;
      const mtime = fs.statSync(file.url).mtime.toString();

      let hash = null;
      let fileContent = null;

      if (typeof cache[cacheKey] !== 'undefined') {
        const cacheMtime = cache[cacheKey].mtime;
        if (mtime === cacheMtime) {
          hash = cache[cacheKey].hash;
          fileContent = cache[cacheKey].fileContent;
        }
      }

      if (!hash) {
        fileContent = jsonminify(
          fs.readFileSync(file.url, 'utf-8')
            .replace(new RegExp('"', 'g'), '\\"'),
        );
        hash = md5(fileContent);
        fileContent = `dispatch('${constants.ADD_TRANSLATIONS}','${lang}',JSON.parse('${fileContent}'),'${pageName}');`;
        cache[cacheKey] = {};
        cache[cacheKey].hash = hash;
        cache[cacheKey].mtime = mtime;
        cache[cacheKey].fileContent = fileContent;
        console.log(`i18n "${file.fileName}" cached!`);
      } else {
        fileContent = cache[cacheKey].fileContent;
        hash = cache[cacheKey].hash;
        console.log(`i18n "${file.fileName}" got from cache!`);
      }

      fse.outputFileSync(`site/static/js/i18n/${helpers.getI18nFileName(lang, pageName)}.js`, fileContent);
      manifest.i18n[helpers.getI18nFileName(lang, pageName)] = hash;
    });
    return manifest;
  } catch (err) {
    console.log('buildI18nFiles error: ', err);
    return manifest;
  }
};

module.exports = {
  buildI18nFiles,
  setChunksHashesToManifest,
};
