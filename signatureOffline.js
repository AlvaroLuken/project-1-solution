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
  const privateKey = "3451c377d47bff61d444cf0abac2e1cb9cd94a80a3a9dc473d7cce4e12ad0272";

  // copy-paste a separate account's public key from your server db in to...
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "0x75852c0235f3cfb2b4263645c513aa2610984624",
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