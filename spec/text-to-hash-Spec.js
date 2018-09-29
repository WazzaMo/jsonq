

const { text_to_hash } = require('../src/text-to-hash');
const crypto = require('crypto');

describe('text_to_hash', () => {

  describe('when given any text', () => {
    let hash_result;

    beforeEach( ()=> {
      hash_result = text_to_hash("mickey mouse had a house " + new Date().toString() );
    });

    it('must have returned a value', ()=> expect(hash_result).toBeDefined() );
    it('creates a 10 char hash', ()=> expect(hash_result.length).toEqual(10) );
  })

  describe('for any varying data,', ()=> {
    function md5(text) {
      const SECRET = 'index-data';
      let hmac = crypto.createHmac('md5', SECRET);
      hmac.update(text, 'utf8');
      return hmac.digest('hex');
    }

    function truncated_md5(text) {
      let hash = md5(text);
      return hash.substr(0,10);
    }

    let hash_result;
    let text_data;

    beforeEach( ()=> {
      text_data = new Date().toString();
      hash_result = text_to_hash(text_data);
    })

    it('produces 10 char, truncated md5', () => expect(hash_result).toEqual( truncated_md5(text_data) ));
  })

})