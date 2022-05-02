# exchange-secp256k1
Uses [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1) instead of elliptic library!


# Flow of Application

1. Run `npm install` to pull down any required dependencies!

2. Start server

Run `node server/index.js` in order to start server and receive 3 public-private key account combinations

3. Start parcel application

Run `npx parcel client/index.js` in order to start application at default localhost:1234

4. Use `signatureOffline.js` to produce a digital signature OFFLINE

Pass in the correct values, the ones from your current server!

Run `node signatureOffline` in order to get your `signature` and your `recoveryBit` (not required to pass into application)

5. In the `Provide Signature + Transfer Amount` section, provide signature + other details needed (recipient, amount)

These must match what you originally signed, otherwise the transfer will fail!

6. Hit `Transfer Amount`

7. If you followed the above flow, your digital signature should have been properly verified and the amount should have transfered!
