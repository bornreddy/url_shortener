var express = require('express');
var router = express.Router();
var db = require('../db');

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
  //make sure that the short string is a unique hash to each site
  new_path = short_string()
  console.log(new_path)
  hostname = req.headers.host
  short_url = hostname + "/" + new_path
  res.render('shorten', { title: short_url });
  //rather than using dicts, use mongo
  console.log("before db save")
  db.save_url(long_url, new_path)
  console.log("after db save")
};

exports.short_redirect = function(req,res) {
  input_path = req.originalUrl.substring(1)
  console.log(input_path)
  console.log("before find url")
  db.find_url(input_path, function(res2) {
    console.log("after find url")
    if (res2 == null) {
      console.log("short url is not valid")
      res.render('error', {message:'not a valid shortened url', error: {}} )
      res.end()
    } else {
    console.log(res2.long_url);
    res.redirect(res2.long_url);
    }
  });
  
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



