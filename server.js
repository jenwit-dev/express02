require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs/promises");
const path = require("path");

// http://localhost:8080/products?_page=2&_limit=5

const productsPath = path.resolve("db", "products.json");

const getProducts = () => fs.readFile(productsPath, "utf8").then(JSON.parse);

// console.log(getProducts());

// getProducts().then((data) => console.log(data[0]));

// Lab Express
// https://docs.google.com/presentation/d/1qt0gb7ZxNqTsRg1g-2BVcMPZkWtpYnvjZQSH9x2LV9A/edit?slide=id.g241b3cd73fd_0_0#slide=id.g241b3cd73fd_0_0

// const arr = ["s", "a", "m", "p", "l", "e"];
// console.log(arr.slice());
// console.log(arr.slice(0, 3));
// console.log(arr.slice(-3));
// console.log(arr.slice(-6, -3));

// const arr2 = ["I", "study", "JS"];
// console.log(arr2.splice(1, 1));
// console.log(arr2);

// const arr3 = ["I", "study", "React"];
// console.log(arr3.splice(0, 2));
// console.log(arr3);

// const arr4 = ["I", "study", "JS", "right", "now"];
// console.log(arr4.splice(0, 3, "Let's", "dance"));
// console.log(arr4);

// const arr5 = ["I", "study", "JS"];
// console.log(arr5.splice(2, 0, "complex", "language"));
// console.log(arr5);

// const arr6 = ["I", "study", "JS"];
// console.log(arr6.splice(3, 0, "complex", "language"));
// console.log(arr6);

app.get("/", (req, res) => {
  //   console.log(path.resolve());
  res.json({ msg: "welcome" });
});

// app.get("/products", (req, res) => {
//   const { _page, _limit } = req.query;
//   console.log(_page, _limit);

//   fs.readFile(productsPath, "utf8").then((result) => {
//     const products = JSON.parse(result);

//     // const productsDefault = products.reduce((acc, item, index) => {
//     //   if (index <= 9) acc.push(item);
//     //   return acc;
//     // }, []);

//     if (!_page && !_limit) {
//       const productsDefault = products.filter((item, index) => index <= 9);
//       console.log(productsDefault.length);
//       res.json(productsDefault);
//     }

//     console.log(products.length);
//   });
// });

app.get("/products", (req, res) => {
  const { _page = 1, _limit = 10 } = req.query;
  getProducts().then((all) => {
    console.log(all.length);
    let start = (+_page - 1) * +_limit;
    let end = start + +_limit;
    // because endIndex is excluded in arr.slice(startIndex, endIndex)
    const output = all.slice(start, end);
    const length = output.length;
    if (output.length == 0) {
      res.status(404).json({ msg: "no data" });
    } else {
      res.json({ start, end, length, output });
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ msg: "resource not found" });
});

const port = process.env.PORT;
app.listen(port, console.log("server running on port", port));
