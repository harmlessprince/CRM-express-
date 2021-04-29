const express = require("express");
const router = express.Router();
const ProfileController = require("./../controllers/ProfileController");
const auth = require("../middlewares/Protect");


router.patch('/update', auth.auth, ProfileController.update);

module.exports = router;