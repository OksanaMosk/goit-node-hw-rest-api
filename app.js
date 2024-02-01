const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/user");
// const nodemailer = require("nodemailer");
require("dotenv").config();

//
// const transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASSWORD,
//   },
// });

// const message = {
//   from: "ksenjap124@gmail.com",
//   to: "ksenjap124@meta.ua",
//   subject: "Hello ",
//   html: "<b>Hello world</b>",
//   text: "Node.js",
// };
// transport
//   .sendMail(message)
//   .then((response) => console.info(response))
//   .catch((error) => console.error(error));
//

const app = express();
require("dotenv").config();

app.use("/avatars", express.static("public/avatars"));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
