const express = require("express");
const router = express.Router();

const { deployRepo } = require ("../controllers/deployController");

router.post("/deploy",deployRepo);

module.exports = router;