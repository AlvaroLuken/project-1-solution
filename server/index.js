/**
 * 
 * Uses @noble/secp256k1
 * Fastest JS implementation of secp256k1. 
 * Independently audited, high-security, 0-dependency ECDSA library
 * 
 * Project 1 - ChainShot
 * 
 */

const express = require('express');
const app = express();
const cors = require('cors');
const secp = require('@noble/secp256k1');
const { keccak_256 } = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
// make sure you include this!
app.use(cors());
app.use(express.json());

// private keys (use )
let privateKey1 = secp.utils.randomPrivateKey();
privateKey1 = Buffer.from(privateKey1).toString('hex');
let privateKey2 = secp.utils.randomPrivateKey();
privateKey2 = Buffer.from(privateKey2).toString('hex');
let privateKey3 = secp.utils.randomPrivateKey();
privateKey3 = Buffer.from(privateKey3).toString('hex');

// public keys
let publicKey1 = secp.getPublicKey(privateKey1);
publicKey1 = Buffer.from(publicKey1).toString('hex');
publicKey1 = "0x" + publicKey1.slice(publicKey1.length - 40);
let publicKey2 = secp.getPublicKey(privateKey2);
publicKey2 = Buffer.from(publicKey2).toString('hex');
publicKey2 = "0x" + publicKey2.slice(publicKey2.length - 40);
let publicKey3 = secp.getPublicKey(privateKey3);
publicKey3 = Buffer.from(publicKey3).toString('hex');
publicKey3 = "0x" + publicKey3.slice(publicKey3.length - 40);

// balance table
// is this decentralized code?
const balances = {
  [publicKey1]: 100,
  [publicKey2]: 50,
  [publicKey3]: 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  // receive values from the client, including signature and recovery bit
  const { recipient, amount, signature } = req.body;

  // begin to construct independent message in the server
  const message = JSON.stringify({
    to: recipient,
    amount: parseInt(amount)
  });

  const signatureInUint8 = Uint8Array.from(Buffer.from(signature, 'hex'));

  // hash the independent message
  // this is where the magic happens!
  const messageHash = bytesToHex(keccak_256(message));

  // recover the public key 1 (just like Ethereum does it) using msgHash, sig
  // recoveryBit = 0
  let recoveredPublicKey1 = secp.recoverPublicKey(messageHash, signature, 0);

  // recover the public key 2 (just like Ethereum does it) using msgHash, sig
  // recoveryBit = 1
  let recoveredPublicKey2 = secp.recoverPublicKey(messageHash, signature, 1);

  // clean up numbers so that they look
  // like the ones in your server.js
  let realKey;
  let saveKey1 = recoveredPublicKey1;
  let saveKey2 = recoveredPublicKey2;
  recoveredPublicKey1 = Buffer.from(recoveredPublicKey1).toString('hex');
  recoveredPublicKey1 = "0x" + recoveredPublicKey1.slice(recoveredPublicKey1.length - 40);
  recoveredPublicKey2 = Buffer.from(recoveredPublicKey2).toString('hex');
  recoveredPublicKey2 = "0x" + recoveredPublicKey2.slice(recoveredPublicKey2.length - 40);

  // log both options to console
  console.log();
  console.log("Recovered PK 1: " + recoveredPublicKey1);
  console.log("Recovered PK 2: " + recoveredPublicKey2);
  console.log();
  
  // so far, none of our two options have been checked
  let publicKeyMatch = false;
  
  // we must declare a TRUE recovered public key!
  // find a match in our server
  let recoveredPublicKey;

  // if either of public keys match an entry in our server, proceed,
  // else mark `publicKeyMatch` false and return, no change
  if(!balances[recoveredPublicKey1] && !balances[recoveredPublicKey2]) {
    console.log();
    console.error("Public key does not match! Make sure you are passing in the correct values!");
    console.log();
    publicKeyMatch = false;
    logBalances();
    return;
  } else if (!balances[recoveredPublicKey1] && balances[recoveredPublicKey2]) {
    recoveredPublicKey = recoveredPublicKey2;
    realKey = saveKey2;
    publicKeyMatch = true;
  } else if (!balances[recoveredPublicKey2] && balances[recoveredPublicKey1]) {
    recoveredPublicKey = recoveredPublicKey1;
    realKey = saveKey1;
    publicKeyMatch = true;
  }

  // console log event
  console.log();
  console.log(recoveredPublicKey + " is attempting to send " + amount + " to " + recipient);
  console.log();

  // this means we have verified that the
  // private key behind this publicKey wishes
  // to enact a valid change to the server.js table
  // no other way to produce match other than to own private key
  if(publicKeyMatch && secp.verify(signature, messageHash, realKey)) {
    // require owner has sufficient balance, else return
    if(balances[recoveredPublicKey] - amount >= 0) {
      balances[recoveredPublicKey] -= amount;
      balances[recipient] = (balances[recipient] || 0) + +amount;
      res.send({ balance: balances[recoveredPublicKey] });
      // log success event
      console.log();
      console.log(recoveredPublicKey + " has successfully sent " + amount + " to " + recipient);
      console.log();
      // after every action, display 
      logBalances();
    } else {
      console.log();
      console.log("Not enough funds!");
      logBalances();
      return;
    }
  } else {
    console.error("Something seems off! Make sure you are passing in the correct values!");
    logBalances();
    return;
  }
});

// function gets executed every time a state change occurs
function logBalances() {
  console.log();
  console.log("================================== ACCOUNTS ==================================");
  console.log();
  console.log("Public Key #1: " + publicKey1 + " has a balance of " + balances[publicKey1]);
  console.log("Acct #1 Private Key: " + privateKey1);
  console.log();
  console.log("Public Key #2: " + publicKey2 + " has a balance of " + balances[publicKey2]);
  console.log("Acct #2 Private Key: " + privateKey2);
  console.log();
  console.log("Public Key #3: " + publicKey3 + " has a balance of " + balances[publicKey3]);
  console.log("Acct #3 Private Key: " + privateKey3);
  console.log();
  console.log("==============================================================================");
  console.log();
}

// check your terminal!
app.listen(port, () => {
  console.log();
  console.log(`Listening on port ${port}!`);
  logBalances();
});
