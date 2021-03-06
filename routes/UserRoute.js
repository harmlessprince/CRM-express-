const express = require("express");
const router = express.Router();
const UserController = require("./../controllers/UserController");
const auth = require("../middlewares/Protect");
const hasRole = require("../middlewares/HasRole");


router
    .route("/")
    .get(UserController.index)
    .post(auth.auth, hasRole.HasRole('admin'), UserController.store);
router
    .route("/:userId")
    .get(UserController.show)
    .patch(auth.auth, hasRole.HasRole("admin"), UserController.update)
    .delete(auth.auth, hasRole.HasRole("admin"), UserController.delete);
module.exports = router;

// , hasRole.HasRole("admin"),