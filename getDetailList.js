var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");
var Queue = require("./queue/queue");
const checkExist = require("./checkExist");

const getDetailList = (arrLink) => {
  var objJson = [];
  const leng = arrLink.length;
  const concurrencyLimit = 100;
  const batchesCount = Math.ceil(leng / concurrencyLimit);

  for (let i = 0; i < batchesCount; i++) {
    var queue = new Queue();
    const batchStart = i * concurrencyLimit;
    var entryCount = 0;
    const batchArguments = arrLink.slice(
      batchStart,
      batchStart + concurrencyLimit
    );
    batchArguments.forEach((element) => {
      element.entryCount = entryCount;
      queue.enqueue(element);
    });

    async function request(queue, entryCount) {
      let qLeng = queue.length;
      for (let j = 0; j <= qLeng; j++) {
        if (!queue.isEmpty()) {
          await requestDetailList(queue.peek())
            .then((res) => {
              if (checkExist(objJson, res) === false) {
                objJson.push(res);
                let json = JSON.stringify(objJson);
                fs.writeFileSync("dataTest.json", json);
              }
              queue.dequeue();
            })
            .catch((err) => {
              let link = { ...err };
              queue.dequeue();
              link.entryCount = entryCount + 1;
              queue.enqueue(link);
            });
        }
      }
      console.log("length: ", queue.length);
      if (queue.length > 0 && entryCount < 5) {
        request(queue, entryCount + 1);
      }
    }
    request(queue, entryCount);
  }
};

const requestDetailList = (link) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: link.link,
        method: "GET",
        proxy: "http://118.69.50.154:80",
        timeout: 15000,
      },
      async function (err, response, body) {
        if (err) {
          if (err.code === "ESOCKETTIMEDOUT" || err.code === "ETIMEDOUT") {
            reject(link);
          }
          console.log("err: ", err.code);
        } else {
          let $ = cheerio.load(body);
          $("div.cf-thongtinshop > div.cf-thongtinshop1").each(
            async function () {
              const title = $(this).find("h2.question").attr("id");
              const content = await $(this).find("div.answer").text();
              if (content) {
                switch (title) {
                  case "1linh-vuc-hoat-dong": {
                    link.fieldsOperation = content;
                    break;
                  }
                  case "1dia-chi": {
                    link.address = content;
                    break;
                  }
                  case "1so-dien-thoai": {
                    link.phoneNumber = content;
                    break;
                  }
                  case "1website": {
                    link.website = content;
                    break;
                  }
                  case "1email": {
                    link.email = content;
                    break;
                  }
                  default:
                    break;
                }
              }
            }
          );
          const description = await $(
            "div.cf-thongtinshop > div.cf-thongtinshop1ab"
          ).text();
          if (description) {
            link.description = description;
          }
          resolve(link);
        }
      }
    );
  });
};

module.exports = getDetailList;
