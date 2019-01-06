var express = require("express");
var moment = require("moment");
var uuid = require("uuid");
var _ = require("lodash");
var firebase = require("firebase-admin");
var db = firebase
	.app()
	.database()
	.ref();

var router = express.Router();

/**
 * request body: {auth, name, email, phone, title, expiredTime, testLink }
 * entity: {auth, key, name, email, phone, title, expiredTime, testLink, createdDate(sys)}
 */
// var body = {
// 	auth: "Ittech1@#$",
// 	name: "Hong Duc Lam",
// 	email: "hongduclam@gmail.com",
// 	phone: "0902796941",
// 	title: "Sr FE",
// 	testLink: "http://localhost.com"
// };
router.post("/create", function(req, res, next) {
	const data = req.body;
	if (data.auth && data.auth === "Ittech1@#$") {
		delete data["auth"];
		var uid = db.child("candidates").push().key;
		data.createdDate = moment().valueOf();
		// do a multi-path write!
		var mergedData = {};
		mergedData["candidates/" + uid] = data;
		db.update(mergedData)
			.then(function(err) {
				if (err) {
					res.status(500).json({
						message: err
					});
				} else {
					return res.status(200).json({
						message: "OK",
						data: uid
					});
				}
			})
			.catch(next);
	}
});

/**
 * body: {key, expiredTime(sys)}
 */
router.post("/register", function(req, res, next) {
	const data = req.body;
	db.child("candidates/" + data.key)
		.once("value")
		.then(function(snapshot) {
			var value = snapshot.val();
			console.log(value);
			if (value) {
				value.expiredTime = moment(value.createdDate)
					.add(8, "h")
					.valueOf();
				var mergedData = {};
				mergedData["candidates/" + data.key] = value;
				db.update(mergedData)
					.then(function(err) {
						if (err) {
							res.status(500).json({
								message: err
							});
						} else {
							return res.status(200).json({
								message: "OK",
								data: value
							});
						}
					})
					.catch(next);
			} else {
				res.status(422).json({
					message: "Key Not Found"
				});
			}
		})
		.catch(next);
});

router.get("/:key", function(req, res, next) {
	var key = req.params.key;
	db.child("candidates/" + key)
		.once("value")
		.then(function(snapshot) {
			var value = snapshot.val();
			console.log(value);
			if (value) {
				res.status(422).json({
					message: "OK",
					data: value
				});
			} else {
				res.status(422).json({
					message: "Key Not Found"
				});
			}
		})
		.catch(next);
});

// get list
router.get("/:key", function(req, res, next) {
	db.child("candidates")
		.once("value")
		.then(function(snapshot) {
			var value = snapshot.val();
			res.status(422).json({
				message: "OK",
				data: value
			});
		})
		.catch(next);
});

router.delete("/:key", function(req, res, next) {
	var adaRef = db.ref("candidates/" + req.body.key);
	adaRef
		.remove()
		.then(function() {
			console.log("Remove succeeded.");
			res.status(422).json({
				message: "OK"
			});
		})
		.catch(function(error) {
			res.status(422).json({
				message: error.message
			});
		});
});

module.exports = router;
