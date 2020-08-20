var request = require("request");
var cheerio = require("cheerio");
var Queue = require("./queue/queue");
var http = require("http");
var setup = require("proxy");
var proxy = require("http-proxy");

getList = async (url, batchStart, batchEnd) => {
  if (batchStart < batchEnd) {
    for (let i = batchStart; i <= batchEnd; i++) {
      const LINK = "http://dlm.vn/giao-duc";
      if (i === 1) {
        await url.push(LINK);
      } else {
        await url.push(LINK + `/page/${i}`);
      }
    }
  } else {
    const LINK = "http://dlm.vn/giao-duc";
    if (batchStart === 1) {
      await url.push(LINK);
    } else {
      await url.push(LINK + `/page/${batchStart}`);
    }
  }

  let result = [];
  const leng = url.length;
  const concurrencyLimit = 50;
  const batchesCount = Math.ceil(leng / concurrencyLimit);

  for (let i = 0; i < batchesCount; i++) {
    var queue = new Queue();
    const batchStart = i * concurrencyLimit;
    const batchArguments = url.slice(batchStart, batchStart + concurrencyLimit);
    batchArguments.forEach((element) => {
      queue.enqueue(element);
    });
    async function request(queue) {
      var data = [];
      let qLeng = queue.length;
      for (let j = 0; j < qLeng; j++) {
        if (!queue.isEmpty()) {
          await requestList(queue.peek())
            .then((res) => {
              data = data.concat(res);
              queue.dequeue();
            })
            .catch((err) => {
              queue.dequeue();
              queue.enqueue(err);
            });
        }
      }
      if (queue.length > 0) {
        request(queue);
      } else {
        return data;
      }
    }
    result = result.concat(request(queue));
  }
  return Promise.all(result);
};

const requestList = (link) => {
  var infor = [];
  return new Promise((resolve, reject) => {
    request(
      {
        url: link,
        method: "GET",
        proxy: "http://118.69.50.154:80",
        timeout: 15000,
      },
      function (err, response, body) {
        if (err) {
          if (err.code === "ESOCKETTIMEDOUT" || err.code === "ETIMEDOUT") {
            reject(link);
          }
          console.log("err: ", err.code);
        } else {
          let $ = cheerio.load(body);
          $("div.post-item").each(function () {
            const link = $(this).find("div.col-inner > a").attr("href");
            const name = $(this).find("div.blog-post-inner > h5").text();
            const typeCompany = $(this).find("div.col-inner > span").text();
            const img = $(this)
              .find("div.box-image > div.image-cover > img")
              .data("src");
            if (link) {
              infor.push({ link, name, typeCompany, img });
            } else {
              reject(link);
            }
          });
        }
        resolve(infor);
      }
    );
  });
};

module.exports = getList;
