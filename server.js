require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");

// http://localhost:8080/products?_page=2&_limit=5

const productsPath = path.resolve("db", "products.json");
const deletedPath = path.resolve("db", "deleted.json");

const getProducts = () => fs.readFile(productsPath, "utf8").then(JSON.parse);
const getDeleted = () => fs.readFile(deletedPath, "utf8").then(JSON.parse);
const saveFile = (file, data) =>
  fs.writeFile(file, JSON.stringify(data, null, 1));

if (!fss.existsSync(deletedPath)) saveFile(deletedPath, []);

const saveToDeleted = (del_item) => {
  return getDeleted().then((all_del) => {
    all_del.push(del_item);
    return saveFile(deletedPath, all_del);
  });
};
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
  const {
    _page = 1,
    _limit = 10,
    _minPrice = 0,
    _maxPrice = 999_999,
  } = req.query;
  getProducts().then((all) => {
    // console.log(all.length);

    const productFilter =
      +_minPrice == 0 && +_maxPrice == 999_999
        ? all
        : all.filter(
            (item) => item.price > +_minPrice && item.price < +_maxPrice
          );

    let start = (+_page - 1) * +_limit;
    let end = start + +_limit;
    // because endIndex is excluded in arr.slice(startIndex, endIndex)
    const output = productFilter.slice(start, end);
    const length = output.length;
    if (output.length == 0) {
      res.status(404).json({ msg: "no data" });
    } else {
      res.json({ start, end, length, output });
    }
  });
});

app.delete("/product/:id", (req, res) => {
  const { id } = req.params;
  getProducts().then((all) => {
    const del_idx = all.findIndex((item) => item.id === +id);
    if (del_idx === -1) return res.status(404).json({ msg: "id not found" });
    const [del_item] = all.splice(del_idx, 1);
    saveFile(productsPath, all);
    // saveFile(deletedPath, del_item);
    saveToDeleted(del_item);
    res.json({ msg: `deleted id=${id}` });
  });
});

app.use((req, res) => {
  res.status(404).json({ msg: "resource not found" });
});

const port = process.env.PORT;
app.listen(port, console.log("server running on port", port));
