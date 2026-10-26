const Group = require("../models/Group");
const { getTransportCost } = require("../utils/transportCosts");

const DESTINATIONS = [
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    budgetRange: [0, 6000],
    costPerDay: 2500,
    image: "https://images.unsplash.com/photo-1591968289588-f8ba7a72e8dd?w=800",
    tags: ["Adventure", "Spiritual", "Nature"],
    highlights: ["White water rafting", "Yoga & meditation", "Camping", "Bungee jumping"],
    bestFor: "Adventure seekers on a tight budget",
    transportCost: { train: 800, bus: 500, road: 600, flight: 3500 },
    hotels: [
      { name: "Rishikesh Riverside Camp", price: 1200, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400" },
      { name: "Ganga View Lodge", price: 1800, image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400" },
      { name: "Shivalik River Retreat", price: 2500, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400" },
    ],
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    budgetRange: [6000, 12000],
    costPerDay: 4000,
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
    tags: ["Heritage", "Culture", "Food"],
    highlights: ["Amber Fort", "Hawa Mahal", "Local bazaars", "Rajasthani cuisine"],
    bestFor: "Culture lovers seeking royal experiences",
    transportCost: { train: 1200, bus: 900, road: 1000, flight: 4000 },
    hotels: [
      { name: "Pink City Heritage Hotel", price: 3500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
      { name: "Rajputana Palace Inn", price: 5000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
      { name: "Hawa Mahal View Resort", price: 6500, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" },
    ],
  },
  {
    name: "Goa",
    state: "Goa",
    budgetRange: [10000, 999999],
    costPerDay: 6000,
    image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800",
    tags: ["Beaches", "Nightlife", "Water Sports"],
    highlights: ["Calangute Beach", "Old Goa churches", "Water sports", "Seafood"],
    bestFor: "Groups wanting beaches and nightlife",
    transportCost: { train: 2500, bus: 2000, road: 3000, flight: 5500 },
    hotels: [
      { name: "Beachside Paradise Resort", price: 5500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
      { name: "Palm Grove Beach Hotel", price: 7000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
      { name: "Sunset Bay Luxury Inn", price: 9000, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" },
    ],
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    budgetRange: [5000, 15000],
    costPerDay: 3500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    tags: ["Mountains", "Snow", "Adventure"],
    highlights: ["Rohtang Pass", "Solang Valley", "Snow activities", "Old Manali"],
    bestFor: "Mountain lovers and snow enthusiasts",
    transportCost: { train: 1500, bus: 1200, road: 1800, flight: 6000 },
    hotels: [
      { name: "Snow Valley Cottages", price: 2500, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" },
      { name: "Himalayan Heights Hotel", price: 4000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
      { name: "Beas River Resort", price: 5500, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
    ],
  },
  {
    name: "Kerala",
    state: "Kerala",
    budgetRange: [8000, 20000],
    costPerDay: 5000,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    tags: ["Backwaters", "Nature", "Wellness"],
    highlights: ["Alleppey backwaters", "Munnar tea gardens", "Ayurvedic spa", "Kathakali shows"],
    bestFor: "Nature & wellness seekers",
    transportCost: { train: 2000, bus: 1800, road: 2500, flight: 5000 },
    hotels: [
      { name: "Backwater Houseboat", price: 6000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Munnar Tea Estate Stay", price: 4500, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=400" },
      { name: "Kovalam Beach Resort", price: 7500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
    ],
  },
];

const VALID_MODES = ["train", "bus", "road", "flight"];

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { groupName, startDate, endDate, maxBudget } = req.body;

    if (!groupName || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Group name and dates are required" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: "End date must be after start date" });
    }

    const group = await Group.create({
      groupName,
      startDate,
      endDate,
      maxBudget: maxBudget || null,
      members: [],
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all groups for logged-in user
// @route   GET /api/groups
// @access  Private
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
const getGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { name, city, budget, travelMode = "train" } = req.body;

    if (!name || !city || budget === undefined) {
      return res.status(400).json({ success: false, message: "Name, city and budget are required" });
    }

    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const VALID_MODES = ["train", "bus", "road", "flight"];

if (!VALID_MODES.includes(travelMode)) {
  return res.status(400).json({
    success: false,
    message: "Invalid travel mode",
  });
}

group.members.push({
  name,
  city,
  budget: Number(budget),
  travelMode,
});
    await group.save();

    res.status(201).json({ success: true, message: "Member added successfully", group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members/:memberId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    group.members = group.members.filter(
      (m) => m._id.toString() !== req.params.memberId
    );
    await group.save();

    res.json({ success: true, message: "Member removed", group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get best destinations for a group
// @route   GET /api/groups/:id/destinations?travelMode=train
// @access  Private

const getBestDestinations = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one member first",
      });
    }

    const memberCount = group.members.length;
    const avgBudget = group.avgBudget;

    const diffTime =
      new Date(group.endDate) - new Date(group.startDate);

    const tripDays = Math.max(
      1,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    );

    const scoredDestinations = DESTINATIONS.map((dest) => {
      // Calculate transport and trip costs separately for each member.
      const memberCosts = group.members.map((member) => {
        const requestedMode = member.travelMode || "train";

        const travelMode = VALID_MODES.includes(requestedMode)
          ? requestedMode
          : "train";

        // Existing estimates; these do not yet depend on origin city.
        const transportResult = getTransportCost(
            member.city,
            dest.name,
            travelMode,
            dest.transportCost[travelMode]
        );

const transportCost = transportResult.cost;

        const stayAndActivitiesCost = dest.costPerDay * tripDays;

        const estimatedTotal = transportCost + stayAndActivitiesCost;

        return {
          memberId: member._id,
          name: member.name,
          city: member.city,
          travelMode,
          estimatedTransportCost: transportCost,
          estimatedStayAndActivitiesCost: stayAndActivitiesCost,
          estimatedTotal,
          budget: member.budget,
          withinBudget: estimatedTotal <= member.budget,
        };
      });

      const totalTransportCost = memberCosts.reduce(
        (sum, member) => sum + member.estimatedTransportCost,
        0
      );

      const totalCost = memberCosts.reduce(
        (sum, member) => sum + member.estimatedTotal,
        0
      );

      const costPerPerson = Math.round(totalCost / memberCount);

      const averageTransportCost = Math.round(
        totalTransportCost / memberCount
      );

      const averageBudgetAfterTravel = Math.round(
        memberCosts.reduce(
          (sum, member) =>
            sum + (member.budget - member.estimatedTransportCost),
          0
        ) / memberCount
      );

      // Calculate how well the estimated trip cost fits each member's budget.
const budgetScores = memberCosts.map((member) => {
  if (member.budget <= 0) {
    return 0;
  }

  const budgetUsage = member.estimatedTotal / member.budget;

  if (budgetUsage <= 1) {
    // More remaining budget means a better budget match.
    return Math.round((1 - budgetUsage * 0.5) * 100);
  }

  // The trip exceeds this member's budget, so reduce the score.
  return Math.max(
    0,
    Math.round(50 - (budgetUsage - 1) * 100)
  );
});

const score = Math.round(
  budgetScores.reduce((sum, value) => sum + value, 0) /
    budgetScores.length
);

      const affordable = memberCosts.every(
        (member) => member.withinBudget
      );

      return {
        ...dest,
        totalCost,
        costPerPerson,
        transportCost: averageTransportCost,
        totalTransportCost,
        budgetAfterTravel: averageBudgetAfterTravel,
        tripDays,
        score: Math.max(0, Math.round(score)),
        affordable,
        memberCosts,
      };
    });

    scoredDestinations.sort((a, b) => {
      // Recommend destinations affordable for everyone first.
      if (a.affordable !== b.affordable) {
        return a.affordable ? -1 : 1;
      }

      return b.score - a.score;
    });

   
res.json({
  success: true,
  avgBudget,
  memberCount,
  tripDays,
  destinations: scoredDestinations,
  groupName: group.groupName,
  cities: group.members.map((member) => member.city),

  // Send individual member details to the frontend
  members: group.members.map((member) => ({
    name: member.name,
    city: member.city,
    budget: member.budget,
    travelMode: member.travelMode,
  })),
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    res.json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  removeMember,
  getBestDestinations,
  deleteGroup,
};
