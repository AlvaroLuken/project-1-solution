const keccak256 = require('keccak256')

(async () => {
  console.log(keccak256(Buffer.from('hello')).toString('hex'))
})();
