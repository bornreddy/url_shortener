var express = require('express');
var router = express.Router();

short_to_long = []
long_to_short = []

exports.generate_short = function(req, res) {
  input_url = req.body.input_url
  if (input_url == "") {
    console.log("url is undefined")
    res.render('error', {message:'Please enter a url to be shortened', error: {}} )
    res.end()
  }
  long_url = http_check(input_url)
  console.log(long_url)
  new_path = short_string()
  console.log(new_path)
  hostname = req.headers.host
  short_url = hostname + "/" + new_path
  res.render('shorten', { title: short_url });
  short_to_long[new_path] = long_url
  long_to_short[long_url] = new_path
  console.log(short_to_long)
  console.log(long_to_short)
};

exports.short_redirect = function(req,res) {
  input_path = req.originalUrl.substring(1)
  console.log(input_path)
  if (input_path in short_to_long) {
   redirect_url = short_to_long[input_path]
   res.redirect(redirect_url)
  } else {
    console.log("short url is not valid")
    res.render('error', {message:'not a valid shortened url', error: {}} )
    res.end()
  }
}

function http_check(url) {
  if (url.substring(0,6) != "http://" || url.substring(0,7) != "https://") {
    url = "http://" + url
  }
  return url
}

function short_string() {
  characters = "12345678901234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  s_string = ""
  for (i = 0; i < 7; i++) {
    index = Math.floor((Math.random() * characters.length) + 1);
    s_string = s_string + characters.substring(index,index+1)
  }
  console.log(s_string)
  return s_string
}



