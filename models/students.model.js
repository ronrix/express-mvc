
// MYSQL
// const Connection = require("../connection/Connection");
const bcrypt = require("bcryptjs");
const PostgresConnection = require("../connection/psql.connection");

const FormValidation = require("../modules/validation/Validation");

class StudentsModel extends PostgresConnection {
	constructor() {
		super();
		this.FormValidation = new FormValidation();
	}

	login = async (fields) => {

		if(this.FormValidation.is_empty(fields)) {
			return {msg: "Please fill up the fields", status: 400};
		}
		
		if(!this.FormValidation.is_email_valid(fields.email)) {
			return {msg: "Email is not valid", status: 400};
		}
		
		const query = {
			text: "SELECT first_name, last_name, email, password FROM _user WHERE email=$1 LIMIT 1",
			values: [fields.email]
		}
		return await this._query(query).then(res => {

			if(!res.rows.length) {
				return { msg: "Wrong email or password", status: 400 };
			}

			const verified = bcrypt.compareSync(fields.password, res.rows[0].password);
			if(verified) {
				return { data: res.rows[0], status: 200 };
			}

		}).catch(err => ({msg: err}));
	}

	// MYSQL
	// email_already_exists(email) {
	// 	const query = this.format_query("SELECT * FROM _user WHERE email=?", {email});
	// 	return new Promise((resolve, reject) => {
	// 		this.connection.query(query, (err, result) => {
	// 			resolve(result);
	// 		});
	// 	});
	// }

	async email_already_exists(email) {

		const query = {
			text: "SELECT * FROM _user WHERE email=$1",
			values: [email]
		};

		return await this._query(query).then(res => {
			if(res.rows.length > 0) {
				return true;
			}
			return false;
		}).catch(err => err);
	}

	register = async (fields) => {

		if(!this.FormValidtion.is_email_valid(fields.email)) {
			return {msg: "Email is not valid", status: 400};
		}

		if(this.FormValidation.is_empty(fields)) {
			return {msg: "Please fill up the fields", status: 400};
		}
		
		const hashed_password = bcrypt.hashSync(fields.password, 10);
		const query = {
			text: "INSERT INTO _user(first_name, last_name, email, password, created_at) VALUES($1, $2, $3, $4, NOW())",
			values: [fields.fname, fields.lname, fields.email, hashed_password]
		};

		// check if email already exists
		return this.email_already_exists(fields.email).then(res => {
			if(!res) {
				this._query(query);
				return {msg: "Success", status: 200};
			}
			return {msg: "Email already exists!", status: 400};
		});


	}
}

module.exports = StudentsModel;