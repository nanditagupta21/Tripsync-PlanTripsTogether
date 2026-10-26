const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  travelMode: {
    type: String,
    enum: ["train", "bus", "road", "flight"],
    default: "train",
  },
});


const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    maxBudget: { type: Number, default: null },
    members: [memberSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "confirmed", "completed"],
      default: "planning",
    },
  },
  { timestamps: true }
);

// Virtual for member count
groupSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Virtual for average budget
groupSchema.virtual("avgBudget").get(function () {
  if (this.members.length === 0) return 0;
  const total = this.members.reduce((sum, m) => sum + m.budget, 0);
  return Math.round(total / this.members.length);
});

groupSchema.set("toJSON", { virtuals: true });
groupSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Group", groupSchema);
