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

app.get("/", (req, res) => {
  //   console.log(path.resolve());
  res.json({ msg: "welcome" });
});

app.get("/products", (req, res) => {
  const { _page, _limit } = req.query;
  console.log(_page, _limit);

  fs.readFile(productsPath, "utf8").then((result) => {
    const products = JSON.parse(result);

    // const productsDefault = products.reduce((acc, item, index) => {
    //   if (index <= 9) acc.push(item);
    //   return acc;
    // }, []);

    if (!_page && !_limit) {
      const productsDefault = products.filter((item, index) => index <= 9);
      console.log(productsDefault.length);
      res.json(productsDefault);
    }

    console.log(products.length);
  });
});

app.use((req, res) => {
  res.status(404).json({ msg: "resource not found" });
});

const port = process.env.PORT;
app.listen(port, console.log("server running on port", port));
