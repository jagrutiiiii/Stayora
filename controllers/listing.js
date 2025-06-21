const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings , selectedCountry: null});
};

module.exports.rendernewform = (req,res) => {
    res.render("listings/new.ejs");
}; 


module.exports.showlisting = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews" , 
        populate : {
            path : "author",
        },
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
};

module.exports.createlisting = async(req,res) =>{

    let response = await geocodingClient.forwardGeocode({
        query : req.body.listing.location ,
        limit : 1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {filename , url};

    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created"); 
    res.redirect("/listings");
};

module.exports.rendereditform = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        return res.redirect("/listings");
    }

    let OriginalimageUrl = listing.image.url;
    OriginalimageUrl= OriginalimageUrl.replace("/upload" , "/upload/h_100,w_250");

    res.render("listings/edit.ejs",{listing , OriginalimageUrl});
};

module.exports.updatelisting = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename , url};
        await listing.save();
    }

    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async(req,res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};


module.exports.searchByCountry = async (req, res) => {
    const { country } = req.query;

    try {
        if (country === 'all') {
            const allListings = await Listing.find({});
            return res.render('listings/index', { allListings, selectedCountry: 'all' });
        }

        const allListings = await Listing.find({ country });

        if (allListings.length === 0) {
            req.flash('error', `No listings found for "${country}"`);
            return res.redirect('/listings');
        }

        res.render('listings/index', { allListings, selectedCountry: country });
    } catch (err) {
        console.error('Search error:', err);
        req.flash('error', 'Something went wrong during search.');
        res.redirect('/listings');
    }
};
