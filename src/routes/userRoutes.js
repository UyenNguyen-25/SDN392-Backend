const express = require("express")
const verifyJWT =require("../middleware/verifyJWT");
const userController =require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createNewUser);
router.post("/check-phone-existed", userController.checkPhoneExisted);

router.use(verifyJWT)

router
  .route("/")
  .get(userController.getAllUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.get("/get-user", userController.getUserDetail)

router
  .route("/confirm-user-address")
  .put(userController.confirmUserAddress);

module.exports = router;

