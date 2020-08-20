var fs = require("fs");
/* var json2xlsx = require("node-json-xlsx"); */

fs.readFile("data2.json", (err, data) => {
  let jsonData = JSON.parse(data);
  exportData(jsonData);
});

const exportData = (jsonData) => {
  let data = "";
  for (var i = 0; i < jsonData.length; i++) {
    if (jsonData[i].link) {
      var link = jsonData[i].link;
    }
    if (jsonData[i].name) {
      var name = jsonData[i].name;
    }
    if (jsonData[i].typeCompany) {
      var typeCompany = jsonData[i].typeCompany;
    }
    if (jsonData[i].img) {
      var img = jsonData[i].img;
    }
    if (jsonData[i].fieldsOperation) {
      var fieldsOperation = jsonData[i].fieldsOperation;
    }
    if (jsonData[i].address) {
      var address = jsonData[i].address;
    }
    if (jsonData[i].phoneNumber) {
      var phoneNumber = jsonData[i].phoneNumber;
    }
    if (jsonData[i].website) {
      var website = jsonData[i].website;
    }
    if (jsonData[i].email) {
      var email = jsonData[i].email;
    }
    if (jsonData[i].description) {
      var description = jsonData[i].description;
    }
    data =
      data +
      link +
      "\t" +
      name +
      "\t" +
      typeCompany +
      "\t" +
      img +
      "\t" +
      fieldsOperation +
      "\t" +
      address +
      "\t" +
      phoneNumber +
      "\t" +
      website +
      "\t" +
      email +
      "\t" +
      description +
      "\n";
  }
  fs.appendFile("data2.xlsx", data, (err) => {
    if (err) throw err;
    console.log("File created");
  });
};
