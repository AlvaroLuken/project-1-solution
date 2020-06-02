import "./index.scss";

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', (event) => {
  fetch(server)
    .then(console.log)
});
