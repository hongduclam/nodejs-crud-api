var express = require("express");
var moment = require("moment");
var token = "Ittech1@#$";
var _ = require("lodash");
var firebase = require("firebase-admin");
var db = firebase
	.app()
	.database()
	.ref();

var router = express.Router();

/**
 * request body: {name, email, phone, title, expiredTime, testLink }
 * entity: {key, name, email, phone, title, expiredTime, testLink, createdDate(sys)}
 */
// var body = {
// 	name: "Hong Duc Lam",
// 	email: "hongduclam@gmail.com",
// 	phone: "0902796941",
// 	title: "Sr FE",
// 	testLink: "http://localhost.com"
// };
router.post("", function (req, res, next) {
	const data = req.body;
	if (req.query.auth !== token) {
		res.status(401).json({
			message: "Don't Hack Me"
		});
	} else {
		delete data["auth"];
		var uid = db.child("candidates").push().key;
		data.createdDate = moment().valueOf();
		data.id = uid;
		// do a multi-path write!
		var mergedData = {};
		mergedData["candidates/" + uid] = data;
		db.update(mergedData)
			.then(function (err) {
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

router.delete("/:id", function (req, res, next) {
	if (req.query.auth !== token) {
		res.status(401).json({
			message: "Don't Hack Me"
		});
	} else {
		firebase.database().ref("candidates/" + req.params.id)
			.remove()
			.then(function () {
				console.log("Remove succeeded.");
				res.status(200).json({
					message: "OK"
				});
			})
			.catch(function (error) {
				res.status(422).json({
					message: error.message
				});
			});
	}
});

// get list
router.get("", function (req, res, next) {
	if (req.query.auth !== token) {
		res.status(401).json({
			message: "Don't Hack Me"
		});
	} else {
		db.child("candidates")
			.once("value")
			.then(function (snapshot) {
				var value = snapshot.val();
				res.status(200).json({
					message: "OK",
					data: Object.values(value)
				});
			})
			.catch(next);
	}
});

router.patch("/:id", function (req, res, next) {
	if (req.query.auth !== token) {
		res.status(401).json({
			message: "Don't Hack Me"
		});
	} else {
		const data = req.body;
		db.child("candidates/" + req.params.id)
			.once("value")
			.then(function (snapshot) {
				var value = snapshot.val();
				console.log(value);
				if (value) {
					var mergedData = {};
					mergedData["candidates/" + req.params.id] = Object.assign(value, data);
					db.update(mergedData)
						.then(function (err) {
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
						message: "Id Not Found"
					});
				}
			})
			.catch(next);
	}
});



//-----------------------
/**
 * body: {key, expiredTime(sys)}
 */
router.post("/register", function (req, res, next) {
	const data = req.body;
	db.child("candidates/" + data.key)
		.once("value")
		.then(function (snapshot) {
			var value = snapshot.val();
			console.log(value);
			if (value) {
				value.expiredTime = moment(value.createdDate)
					.add(8, "h")
					.valueOf();
				var mergedData = {};
				mergedData["candidates/" + data.key] = value;
				db.update(mergedData)
					.then(function (err) {
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

router.get("/:key", function (req, res, next) {
	var key = req.params.key;
	db.child("candidates/" + key)
		.once("value")
		.then(function (snapshot) {
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

module.exports = router;