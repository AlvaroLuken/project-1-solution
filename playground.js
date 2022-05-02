const {keccak_256} = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');
const secp = require("@noble/secp256k1");

(async () => {
  let privateKey1 = secp.utils.randomPrivateKey();
  privateKey1 = Buffer.from(privateKey1).toString('hex');
  console.log("Private Key: " + privateKey1);
  let publicKey1 = secp.getPublicKey(privateKey1);
  publicKey1 = Buffer.from(publicKey1).toString('hex');
  publicKey1 = "0x" + publicKey1.slice(publicKey1.length - 40);
  console.log("Public Key: " + publicKey1);

  const h1a = bytesToHex(keccak_256('abc'));
  console.log(h1a);

  const signatureArray = await secp.sign(h1a, privateKey1, {
    recovered: true
  });

  let signature = signatureArray[0];
  const recoveryBit = signatureArray[1];

  signature = Buffer.from(signature).toString('hex');
  console.log("Signature: " + signature);
  console.log("Recovery bit: " + recoveryBit);

  let recoveredPublicKey1 = secp.recoverPublicKey(h1a, signature, recoveryBit);
  let check = secp.verify(signature, h1a, recoveredPublicKey1);
  console.log(check);
  recoveredPublicKey1 = Buffer.from(recoveredPublicKey1).toString('hex');
  recoveredPublicKey1 = "0x" + recoveredPublicKey1.slice(recoveredPublicKey1.length - 40);


  console.log("Recovered PK: " + recoveredPublicKey1);

  if(recoveredPublicKey1 == publicKey1) {
    console.log("ALL GOOD!");
  }

  

  
})()