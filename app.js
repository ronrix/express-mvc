const express = require("express");
const session = require("express-session");

// YAML
const yaml = require('js-yaml');
const fs   = require('fs');
// Get document, or throw exception on error
const {PORT} = yaml.load(fs.readFileSync('config.yml', 'utf8'));
// const {PORT} = require("./config");
const bodyParser = require("body-parser");


const app = express();

app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended: true})); 
// setup session
app.use(session({
	secret: "supersecret",
	resave: false,
	saveUninitialized: true
}));

/*
	DOCU: setting up profiler to get the data to be dispplayed, you can turn the profile by doing
		req.enable_profiler = true
	OWNER: ronrix
*/
const Profiler = require("./modules/profiler/Profiler");
app.use(new Profiler().setup);

// set up view engine
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");

// including all route files (DON'T CHANGE THIS)
const Routes = require("./routes");
Routes.get().then(routes => {
	app.use([...routes]);
});

app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`));