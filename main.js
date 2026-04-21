const app = document.getElementById("app");

app.innerHTML = "PGIS loaded";

const math = require("./utils/math.js");

console.log(math.add(2, 3));
