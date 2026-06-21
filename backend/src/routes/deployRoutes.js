console.log("deploy routes loaded");

const express = require("express");
const router = express.Router();

const { deployRepo } = require ("../controllers/deployController");
const {deleteApplication} = require ("../controllers/deleteController");

router.post("/deploy",deployRepo);


router.delete(
    "/apps/:appName",
    deleteApplication
);

module.exports = router;

