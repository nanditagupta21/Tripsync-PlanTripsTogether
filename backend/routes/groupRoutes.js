const express = require("express");
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  removeMember,
  getBestDestinations,
  deleteGroup,
} = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // all group routes require auth

router.route("/").get(getMyGroups).post(createGroup);
router.route("/:id").get(getGroup).delete(deleteGroup);
router.route("/:id/members").post(addMember);
router.route("/:id/members/:memberId").delete(removeMember);
router.route("/:id/destinations").get(getBestDestinations);

module.exports = router;
