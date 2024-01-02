const express = require("express");

const {
  createUserMembership,
  getUserMemberships,
  getUserMembership,
} = require("../controllers/userMemberships-controller.js");

const userMembershipRouter = express.Router();

userMembershipRouter
  .route("/")
  .post(createUserMembership)
  .get(getUserMemberships);
userMembershipRouter.route("/:membershipId").get(getUserMembership);

module.exports = userMembershipRouter;