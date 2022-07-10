// Cloudinary
const { cloudinaryConfigEnum } = require("../enums");
const cloudinary = require("cloudinary").v2;
cloudinary.config(cloudinaryConfigEnum);

// Files
const fs = require('fs');



class CloudinaryController
{
}



module.exports = CloudinaryController;
