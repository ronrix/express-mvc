const { Client } = require("pg");
// const {db_config_postgres} = require("../config");

// YAML
const yaml = require('js-yaml');
const fs   = require('fs');
// Get document, or throw exception on error
const {db_config_postgres} = yaml.load(fs.readFileSync('config.yml', 'utf8'));


class PostgresConnection {
	constructor() {
		// POSTGRE SQL setup
		this.client = new Client(db_config_postgres);

		// initializing connection
		this.client.connect().then(() => console.log("PostgreSQL connected")).catch(err => console.log(`${err}`));
	}

	async _query(query) {
		return await this.client.query(query);
	}
}

module.exports = PostgresConnection;