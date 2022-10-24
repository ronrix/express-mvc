
class SurveyController {

	survey = (req, res) => {
		req.enable_profiler(this, req, true);

		res.view("../views/survey.view.ejs");
		
		// res.render("../views/survey.view.ejs");
	}

	result = (req, res) => {
		const survey = req.session.survey;
		req.enable_profiler(this, req, true);
		
		if(survey) {

			// access the keys using data ex(data.something)
			res.view("../views/result.view.ejs", survey);
			
			// res.render("../views/result.view.ejs", {data})
			return;
		}
		res.redirect("/survey");
	}

	submit = (req, res) => {
		if(req.body.name) {
			req.session.survey = req.body;
			res.redirect("/result");
			return;
		}
		res.redirect("/survey");
	}

}

module.exports = new SurveyController();