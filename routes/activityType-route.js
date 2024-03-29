const express = require("express");

const {
  createType,
  getTypes,
  updateTypes,
  deleteType,
} = require("../controllers/activityTypes-controller.js");
const { authenticate, authorize } = require("../middlewares/authentication.js");
// const upload = require("../middlewares/uploadmultipleImages.js");

const uploadMultiple = require("../middlewares/uploadmultipleImages.js");
const { cloudinaryUpload } = require("../middlewares/cloudinary.js");

const typeRouter = express.Router();

typeRouter
  .route("/")
  .post(
    authenticate,
    authorize("admin"),
    uploadMultiple,
    cloudinaryUpload,
    createType
  )
  .get(getTypes);

typeRouter
  .route("/:id/update")
  .patch(authenticate, authorize("admin"), updateTypes);
  typeRouter
  .route("/:id")
  .delete(authenticate, authorize("admin"), deleteType);
module.exports = typeRouter;
