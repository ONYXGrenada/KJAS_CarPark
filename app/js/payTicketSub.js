const { ipcRenderer } = require("electron");
const dbconnection = require("../../app/js/dbconnection");
const appUtils = require("../../app/js/appUtils");

let userInfo;
let ticket;
let paymentMethod;
let paymentAmount;
let chequeNumber;
let paymentReturn = document.querySelector("#txtPaymentReturn");
let payment;

// Get the user on window creation
ipcRenderer.on("send:user", (event, user) => {
  userInfo = user;
});

//Listen for Ticket Number
document
  .querySelector("#txtTicketNumber")
  .addEventListener("keyup", async (e) => {
    e.preventDefault();
    console.log("e.keycode " + e.keyCode);
    if (e.keyCode == 13) {
      const ticketNumber = document.querySelector("#txtTicketNumber").value;
      ticket = await dbconnection.getTicket(ticketNumber, userInfo.username);

      if (ticket.id > 0) {
        let data = {
          height: 600,
          window: "payTicketSub",
        };
        document.querySelector("#customerTicket").removeAttribute("hidden");
        ipcRenderer.send("window:resize", data);
      } else {
        let data = {
          height: 150,
          window: "payTicketSub",
        };
        document.querySelector("#customerTicket").setAttribute("hidden", true);
        ipcRenderer.send("window:resize", data);
      }
      //Set ticket values
      let endTime = new Date();
      let ticketDuration = convertMS(endTime - ticket.createdDate);
      let ticketCost = ticket.rate * ticketDuration.hour;
      let displaySTime =
        ticket.createdDate.getFullYear() +
        "/" +
        ticket.createdDate.getMonth() +
        "/" +
        ticket.createdDate.getDate() +
        " " +
        ticket.createdDate.getHours() +
        ":" +
        ticket.createdDate.getMinutes() +
        ":" +
        ticket.createdDate.getSeconds();
      let displayETime =
        endTime.getFullYear() +
        "/" +
        endTime.getMonth() +
        "/" +
        endTime.getDate() +
        " " +
        endTime.getHours() +
        ":" +
        endTime.getMinutes() +
        ":" +
        endTime.getSeconds();
      document.getElementById("sTime").innerHTML =
        "Enter Time: " + displaySTime;
      document.getElementById("eTime").innerHTML = "Exit Time: " + displayETime;
      document.getElementById("duration").innerHTML =
        "Duration: " +
        ticketDuration.day +
        " day(s) " +
        ticketDuration.hour +
        " hour(s) " +
        ticketDuration.minute +
        " mintue(s) " +
        ticketDuration.seconds +
        " second(s)";
      document.getElementById("tType").innerHTML =
        "Ticket Type: " + ticket.ticketType;
      document.getElementById("tCost").innerHTML = "Cost: " + ticket.ticketCost;
      //calculate cost (need ticket create date, rate and now)
      console.log(ticket.id + " this is where the ticket is supposed to print");
    }
  });

// Listen for form changes
document.querySelector("#collectPayment").addEventListener("change", () => {
  paymentMethod = document.querySelector("#txtPaymentMethod").value;
  paymentAmount = document.querySelector("#txtPaymentAmount").value;
  chequeNumber = document.querySelector("#txtChequeNumber").value;
  if (paymentMethod == "cash" && paymentAmount != null) {
    document.querySelector("#btnPayTicket").disabled = false;
  } else if (
    paymentMethod == "cheque" &&
    paymentAmount != null &&
    chequeNumber != null
  ) {
    document.querySelector("#btnPayTicket").disabled = false;
  } else {
    document.querySelector("#btnPayTicket").disabled = true;
  }
});

//Listen for Pay Ticket Button and close ticket after payment (How to handle Bar Code Scanner?)
document.querySelector("#btnPayTicket").addEventListener("click", async () => {
  payment = appUtils.processPayment(
    ticket.rate,
    paymentMethod,
    paymentAmount,
    chequeNumber
  );
  paymentReturn.innerHTML =
    "Please return $" + payment.change + " to the customer.";
  let receipt = await dbconnection.createReceipt(
    ticket.ticketType,
    ticket.ticketNumber,
    payment.paymentStatus,
    payment.cost,
    payment.paymentStatus,
    payment.balance,
    payment.payAmount,
    payment.cost,
    payment.method,
    payment.chequeNumber,
    userInfo.username
  );
  if (receipt.id) {
    //Pop up dialog box displaying ticket number
    let data = {
      receipt: receipt,
      parentWindow: "payTicketSub",
    };
    ipcRenderer.send("send:receipt", data);
    // Placeholder for print function or code
    console.log("This is where we print the receipt# " + receipt.id);
  } else {
    console.log("Something went very wrong!");
  }
});

function convertMS(milliseconds) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return {
    day: day,
    hour: hour,
    minute: minute,
    seconds: seconds,
  };
}
