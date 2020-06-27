const { argv } = require("yargs");
const { red, inverse, green, cyan } = require("chalk");
const { verify } = require("jsonwebtoken");
const { eachLine } = require("line-reader");
const { stdout } = require("process");
const { existsSync } = require("fs");
const log = require("log-update");

const { token, file } = argv;
let counter = 0;

if (!token || !file) {
  return console.log(red("Missing flags"));
}

if (!existsSync(file)) {
  return console.log(red("File does not exist"));
}

eachLine(file, async (line, last, cb) => {
  const data = await verifyJWT(token, line);
  if (data) {
    console.log(data);
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
    return `Secret is "${secret}"`;
  } catch ({ message }) {}
};
