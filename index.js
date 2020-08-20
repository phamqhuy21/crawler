/* var express = require("express");
var app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/myDatabase");

const inforSchema = new mongoose.Schema({
  link: String,
  name: String,
  typeCompany: String,
  img: String,
  fieldsOperation: String,
  email: String,
  description: String,
});

const infor = mongoose.model("infor", inforSchema);

app.listen(3000); */

/* var EventEmitter = require("events").EventEmitter; */

/* emitter = new EventEmitter(); */

const getList = require("./getList.js");
const getDetailList = require("./getDetailList.js");

var url = [];
var countPage = 20;

const divideCountPage = async (url, countPage) => {
  const concurrencyLimit = 30;
  const batchesCount = Math.ceil(countPage / concurrencyLimit);
  for (let i = 0; i < batchesCount; i++) {
    var batchStart = i * concurrencyLimit + 1;

    if (countPage - batchStart < concurrencyLimit) {
      var batchEnd = countPage;
    } else {
      var batchEnd = concurrencyLimit * (i + 1);
    }
    await getList(url, batchStart, batchEnd).then((res) => {
      var arrLink = [];
      res.forEach((element) => {
        arrLink = arrLink.concat(element);
      });

      if (arrLink.length > 0) {
        getDetailList(arrLink);
      }
    });
  }
};

divideCountPage(url, countPage);

/* getList(url, 1, 2).then((res) => {
  var arrLink = [];
  res.forEach((element) => {
    arrLink = arrLink.concat(element);
  });

  if (arrLink.length > 0) {
    getDetailList(arrLink);
  }
}); */
