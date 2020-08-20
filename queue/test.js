var Queue = require("./queue.js");
var queue = new Queue();

const detail = {
  url: "",
  countTry: 0,
  error: "",
};

queue.enqueue(detail);
queue.enqueue(detail);
queue.enqueue(detail);
if (!queue.isEmpty()) {
  console.log(queue.isEmpty());
}
