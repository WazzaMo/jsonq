const crypto = require('crypto');

const CLIP_LEN = 10;

function makeHasher() {
  return crypto.createHmac('md5', 'index-data');
}

function hashData(hmac, data) {
  hmac.update(data, 'utf8');
  return hmac.digest('hex');
}

function text_to_hash(text) {
  let hmac = makeHasher();
  let fullHash = hashData(hmac, text);
  return fullHash.substr(0,CLIP_LEN);
}

module.exports = {
  text_to_hash
}