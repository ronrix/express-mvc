const PORT = 8000;

// MYSQL
// const db_config = {
// 	server_name: "localhost",
// 	username: "wp_user",
// 	password: "WP_password12",
// 	dbname: "users",
// 	port: 3306,
// }

const db_config_postgres = {
	host: "localhost",
	user: "ronrix",
	password: "root",
	database: "users",
	port: 5432
}

module.exports = {
	PORT,
	db_config_postgres,
}