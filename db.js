var mongoose = require('mongoose');

//create url Schema
var urlSchema = mongoose.Schema({
	long_url: String,
	short_path: String,
	times_clicked: Number 
});

//after adding any object methods, compile url schema
var Url = mongoose.model('Url', urlSchema)

//save and find functions for urls in the database below:
exports.save_url = function(l_url, s_path) {
  var url = new Url({long_url: l_url, short_path: s_path, times_clicked: 1});
  url.save(function(err,res) {
  	if (err) { 
  		console.log("err: " + err);
  		return console.error(err);
  	}
  	console.log(l_url + ": saved url to database");
  });
}

exports.find_url = function(s_url, callback) {
  Url.findOne({short_path:s_url}, function(err,res) {
    if (err) {
    	console.log("err: " + err);
    	return console.error(err);
    }
    console.log(res);
    callback(res)
  })
}



