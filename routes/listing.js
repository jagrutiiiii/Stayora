const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {isLoggedin, isOwner , validatelisting} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); 

//Index route , Create route
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedin ,validatelisting,upload.single('listing[image][url]'), wrapAsync(listingController.createlisting));

router.get('/search', wrapAsync(listingController.searchByCountry));

//New Route
router.get("/new",isLoggedin , listingController.rendernewform);


//Show route ,  Update route , Delete route
router.route("/:id")
.get(wrapAsync(listingController.showlisting))
.put(isLoggedin, isOwner , upload.single('listing[image][url]'), validatelisting,wrapAsync(listingController.updatelisting))
.delete(isLoggedin,isOwner ,wrapAsync(listingController.deletelisting));


//Edit route
router.get("/:id/edit",isLoggedin , wrapAsync(listingController.rendereditform));




module.exports = router;
