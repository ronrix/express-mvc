/*
	DOCU: Add a class to handle routes that can access model and views folder
		you can create more file that has specific routing handlers

		use arrow function (recommended) to enable profiler properly
	OWNER: ronrix
*/ 
const HomeModel = require("../models/HomeModel");

class HomeController {

	constructor() {
		// instance of models
		this.model = new HomeModel();
	}

	// route methods
	index = (req, res) => {
		const msg = req.session.msg

		// use res.view instead of render to use profiler
		req.enable_profiler(this, req, true);

		// redirect to profile if user is logged in
		req.redis.get("sess:"+req.session.id, (err, object) => {
			if(err) {
				res.redirect("/");
				return;
			}
			const parsed_object = JSON.parse(object);
			const data = parsed_object.data;
			// if no data, redirect to homepage
			if(!data) {
				res.view("../views/index", msg);
				return;
			}
			// use res.view instead of render to use profiler
			res.redirect("/profile");
		});

		// res.render("../views/index", {msg});
	}

	profile = (req, res) => {
		req.enable_profiler(this, req, true);
		req.redis.get("sess:"+req.session.id, (err, object) => {
			if(err) {
				res.redirect("/");
				return;
			}
			const parsed_object = JSON.parse(object);
			const data = parsed_object.data;
			// if no data, redirect to homepage
			if(!data) {
				res.redirect("/");
				return;
			}
			// use res.view instead of render to use profiler
			res.view("../views/profile", data);
		});
	}

	login = (req, res) => {
		const fields = req.body;
		this.model.login(fields).then(result => {
			// set the result to the session
			req.session.data = {id: result[0].id, first_name: result[0].first_name, email: result[0].email};
			
			req.session.msg = null;
			res.redirect("/profile");
		}).catch(err => {
			req.session.msg = err;
			res.redirect("/");
		});
	}

}

module.exports = new HomeController();