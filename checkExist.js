const checkObject = require("./checkObject");

const checkExist = (arr, element) => {
  for (let i = 0; i < arr.length; i++) {
    if (checkObject(arr[i], element) === true) return true;
  }
  return false;
};

module.exports = checkExist;
