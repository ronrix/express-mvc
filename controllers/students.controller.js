const StudentsModel = require("../models/students.model");

class UserController {

	constructor() {
		this.Students = new StudentsModel();
	}
	
	index = (req, res) =>  {
		req.enable_profiler(this, req, true);

		const msg = req.session.msg;
		req.session.msg = null;
		res.view("../views/index.view.ejs", msg);
	}

	login = (req, res) => {
		const fields = req.body;

		this.Students.login(fields).then(result => {
			if(result.status === 200) {
				req.session.data = result;
				res.redirect("/students/profile.view.ejs");
				return;
			}
			req.session.msg = result;
			res.redirect("/");
		}).catch(err => {
			req.session.msg = err;
			res.redirect("/");
		});
	}

	register = (req, res) => {
		const fields = req.body;
		
		// check if password and confirm password is correct
		if(fields.password === fields.confirm_password) {

			this.Students.register(fields).then((data) => {
				req.session.msg = data;
				res.redirect("/");
			}).catch(err => {
				req.session.msg = err;
				res.redirect("/");
			});
			return;
		}

		req.session.msg = {msg: "Password not matched!", status: 400};
		res.redirect("/");
	}


	profile = (req, res) => {
		req.enable_profiler(this, req, true);

		if(req.session.data && Object.keys(req.session.data).length > 0) {
			res.view("../views/profile.view.ejs", {data: req.session.data});
			return;
		}
		res.redirect("/");
	}

	logoff(req, res) {
		req.session.data = null;
		res.redirect("/");
	}

}

module.exports = new UserController();