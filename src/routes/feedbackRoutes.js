const express = require("express")
const verifyJWT = require("../middleware/verifyJWT");
const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

router.use(verifyJWT)

router.route("/create-feedback").post(feedbackController.createFeedback);
// router.route("/update-feedback/:feedback_id").put(feedbackController.updateFeedback);
// router.route("/delete-feedback/:feedback_id").delete(feedbackController.deleteFeedback);

module.exports = router;