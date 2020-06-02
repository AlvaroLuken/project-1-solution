const express = require('express');
const app = express();
const port = 3042;

const balances = {
  "1": 100,
  "2": 50,
  "3": 75,
}

app.get('/balance', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
