const express = require("express")
const verifyJWT = require("../middleware/verifyJWT");
// const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

router.use(verifyJWT)

// router.route("/create-feedback").post(feedbackController.createNewFeedback);

module.exports = router;