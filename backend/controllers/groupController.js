const Group = require("../models/Group");

// Destination data with rich metadata
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
    hotels: [
      { name: "Backwater Houseboat", price: 6000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Munnar Tea Estate Stay", price: 4500, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=400" },
      { name: "Kovalam Beach Resort", price: 7500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
    ],
  },
];

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
    const { name, city, budget } = req.body;

    if (!name || !city || budget === undefined) {
      return res.status(400).json({ success: false, message: "Name, city and budget are required" });
    }

    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    group.members.push({ name, city, budget: Number(budget) });
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
// @route   GET /api/groups/:id/destinations
// @access  Private
const getBestDestinations = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (group.members.length === 0) {
      return res.status(400).json({ success: false, message: "Add at least one member first" });
    }

    const avgBudget = group.avgBudget;
    const memberCount = group.members.length;

    // Calculate trip duration in days
    const diffTime = Math.abs(new Date(group.endDate) - new Date(group.startDate));
    const tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Score and rank destinations
    const scoredDestinations = DESTINATIONS.map((dest) => {
      const totalCost = dest.costPerDay * tripDays * memberCount;
      const costPerPerson = dest.costPerDay * tripDays;

      // Score: how close the budget matches
      const budgetMatch =
        avgBudget >= dest.budgetRange[0] && avgBudget <= dest.budgetRange[1];
      const budgetDiff = Math.abs(avgBudget - (dest.budgetRange[0] + dest.budgetRange[1]) / 2);
      const score = budgetMatch ? 100 - budgetDiff / 100 : 50 - budgetDiff / 200;

      return {
        ...dest,
        totalCost,
        costPerPerson,
        tripDays,
        score: Math.max(0, Math.round(score)),
        affordable: avgBudget >= dest.costPerDay * tripDays,
      };
    });

    // Sort by score descending
    scoredDestinations.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      avgBudget,
      memberCount,
      tripDays,
      destinations: scoredDestinations,
      groupName: group.groupName,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
