const { argv } = require("yargs");
const { red, inverse, green, cyan } = require("chalk");
const { verify } = require("jsonwebtoken");
const { eachLine } = require("line-reader");
const { stdout } = require("process");
const { existsSync } = require("fs");
const log = require("log-update");
const notifier = require("node-notifier");

const { token, file } = argv;
let counter = 0;

if (!token || !file) {
  return console.log(red("Missing flags"));
}

if (!existsSync(file)) {
  return console.log(red("File does not exist"));
}

eachLine(file, async (line, last, cb) => {
  const secret = await verifyJWT(token, line);
  if (secret) {
    console.log("Secret is", secret);
    notifier.notify({
      title: "Secret key found",
      message: secret,
    });
    cb(false);
  } else {
    counter += 1;
    log("Scanned password with no results", "[", cyan(counter), "]");
    cb();
  }
});

const verifyJWT = async (token, secret) => {
  try {
    const data = await verify(token, secret);
    console.log(green.inverse("SUCCESS"));
    return secret;
  } catch ({ message }) {}
};
