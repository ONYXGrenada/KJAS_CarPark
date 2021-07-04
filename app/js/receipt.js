const { ipcRenderer } = require("electron");

let receiptNumber = document.querySelector("#receiptNumber");
let receiptDate = document.querySelector("#receiptDate");
let receiptTime = document.querySelector("#receiptTime");
let parseDateTime;
//Get receipt data to display on receipt template
ipcRenderer.on("send:data", (event, data) => {
  receiptNumber.innerHTML = "Receipt #: " + data.id + "<br>";
  //Split Date and Time
  parseDateTime = data.createdDate.split(" ");
  receiptDate.innerHTML = "Date: " + parseDateTime[0] + "<br>";
  receiptTime.innerHTML = "Time: " + parseDateTime[1] + "<br>";
});
