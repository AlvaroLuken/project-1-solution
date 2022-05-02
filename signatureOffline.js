/**
 * 
 * Use this script offline to generate a valid digital signature
 * using your private key
 * 
 * Similar to how a hardware wallet works!
 */

const secp = require("@noble/secp256k1");
const { keccak_256 } = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');

(async () => {
  // copy-paste a private key generated when running server/index.js
  const privateKey = "8ce7352a9ba38700358bc889fe6dc92b55654b359e8ad8d1e2949b8581ca8bdf";

  // copy-paste a separate account's public key from your server db in to...
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "0x5895a44380eddd3500b1669edf368bd594fa8f29",
    amount: parseInt(44)
  });
  
  // hash your plaintext message
  const messageHash = bytesToHex(keccak_256(message));

  // use secp.sign() to produce digital signature and recovery bit
  // result is an array of two elements!
  const signatureArray = await secp.sign(messageHash, privateKey, {
    recovered: true
  });

  // separate out returned array into the string signature and the number recoveryBit
  let signature = signatureArray[0];
  const recoveryBit = signatureArray[1];

  // use these values in your client!
  signature = Buffer.from(signature).toString('hex');
  console.log("Signature: " + signature);
  console.log("Recovery bit: " + recoveryBit);
})();