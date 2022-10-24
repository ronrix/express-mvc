const express = require("express")
const router = express.Router();

// controllers
const StudentsController = require("../controllers/students.controller");

router.get("/", StudentsController.index);

router.post("/login", StudentsController.login);
router.post("/register", StudentsController.register);

router.get("/students/profile", StudentsController.profile);
router.get("/logoff", StudentsController.logoff);

module.exports = router;