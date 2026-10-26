
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Calculate totals and budget status using JavaScript.
function calculateMemberBudget(
  transport,
  accommodation,
  foodAndActivities,
  budget
) {
  const total =
    transport + accommodation + foodAndActivities;

  return {
    transport,
    accommodation,
    foodAndActivities,
    total,
    budget,
    remaining: budget - total,
    status: total > budget ? "Over budget" : "Within budget",
  };
}

// Accept only valid, non-negative cost numbers.
function getCost(value, fieldName) {
  const amount = Number(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    throw new Error(`Invalid or missing cost: ${fieldName}`);
  }

  return Math.round(amount);
}

router.post("/recommend", async (req, res) => {
  try {
    const { budget, tripDays, cities, preferences, members } = req.body;

    if (
      budget === undefined ||
      budget === null ||
      !Number.isFinite(Number(budget)) ||
      Number(budget) <= 0 ||
      typeof preferences !== "string" ||
      !preferences.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid budget and travel preferences are required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured.",
      });
    }

    if (
      !Array.isArray(members) ||
      members.length === 0 ||
      members.some(
        (member) =>
          !member.name ||
          !member.city ||
          !Number.isFinite(Number(member.budget)) ||
          Number(member.budget) < 0 ||
          !member.travelMode
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid member details are required.",
      });
    }

    const averageBudget = Number(budget);
    const days = Number(tripDays);

    if (!Number.isInteger(days) || days < 1) {
      return res.status(400).json({
        success: false,
        message: "Trip duration must be at least 1 day.",
      });
    }

    const safeMembers = members.map((member) => ({
      name: String(member.name),
      city: String(member.city),
      budget: Number(member.budget),
      travelMode: String(member.travelMode),
    }));

    const startingCities = Array.isArray(cities)
      ? cities
      : safeMembers.map((member) => member.city);

    console.log("AI request budget:", averageBudget);
    console.log("AI request tripDays:", days);
    console.log("AI request members:", safeMembers);
    console.log("AI request preferences:", preferences);

    const prompt = `
You are the destination-planning AI for TripSync.

Recommend exactly 3 suitable destinations in India.

GROUP DETAILS
Average budget per person: ₹${averageBudget}
Trip duration: ${days} days
Accommodation nights: ${Math.max(0, days - 1)}

Starting cities:
${JSON.stringify(startingCities)}

Exact member details:
${JSON.stringify(safeMembers, null, 2)}

Group preferences:
${preferences}

RULES
1. Consider each member's actual budget, city and travel mode.
2. Recommend destinations that suit the preferences and budget.
3. Estimate round-trip transport separately for every member.
4. Use each member's actual starting city and chosen travel mode.
5. Accommodation and food/activity costs are per person.
6. Accommodation costs must cover ${Math.max(0, days - 1)} nights.
7. Food and activities must cover ${days} days.
8. All costs are approximate estimates, not live-verified prices.
9. Do not claim live fares, hotel availability or event availability.
10. State important assumptions and travel-time limitations.
11. Suggest 3 activities per destination.
12. Preserve every member's exact name, city, budget and travel mode.
13. Do not calculate member totals or budget status. The server
    will calculate these using JavaScript.
14. Return numeric costs in INR without currency symbols in JSON.
15. Return exactly 3 destinations.
16. Use concise descriptions.
17. Do not invent members or change their details.
18. If a cost is uncertain, provide a reasonable approximate estimate
    and explain the uncertainty in the consideration field.

Return valid JSON only, using this exact structure:

{
  "destinations": [
    {
      "name": "Destination name",
      "whyItSuits": "Short explanation",
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "accommodationPerPerson": 1500,
      "foodAndActivitiesPerPerson": 2500,
      "members": [
        {
          "name": "Exact member name",
          "transportCost": 2500
        }
      ],
      "consideration": "Important travel-time or cost assumption"
    }
  ]
}

Include every provided member exactly once in each destination's
members array, in the same order as the input member list.
Use numeric, non-negative costs for all cost fields.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // Parse Gemini's structured response.
    let parsed;

    try {
      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      parsed = JSON.parse(text);
    } catch (error) {
      console.error("Unable to parse AI JSON:", error.message);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid response. Please try again.",
      });
    }

    if (
      !Array.isArray(parsed.destinations) ||
      parsed.destinations.length !== 3
    ) {
      return res.status(502).json({
        success: false,
        message: "AI did not return exactly 3 destinations. Please try again.",
      });
    }

    // Recalculate all totals and statuses using trusted input data.
    const destinations = parsed.destinations.map((destination) => {
      if (
        !destination.name ||
        !Array.isArray(destination.members) ||
        destination.members.length !== safeMembers.length
      ) {
        throw new Error("AI returned incomplete destination or member data.");
      }

      const accommodation = getCost(
        destination.accommodationPerPerson,
        "accommodationPerPerson"
      );

      const foodAndActivities = getCost(
        destination.foodAndActivitiesPerPerson,
        "foodAndActivitiesPerPerson"
      );

      const calculatedMembers = safeMembers.map((member, index) => {
        const aiMember = destination.members[index];

        // Do not accept a reordered or substituted member.
        if (!aiMember || aiMember.name !== member.name) {
          throw new Error(
            `AI member order or name mismatch for ${member.name}.`
          );
        }

        const transport = getCost(
          aiMember.transportCost,
          `transportCost for ${member.name}`
        );

        const costs = calculateMemberBudget(
          transport,
          accommodation,
          foodAndActivities,
          member.budget
        );

        return {
          ...member,
          ...costs,
        };
      });

      return {
        name: String(destination.name),
        whyItSuits: String(destination.whyItSuits || ""),
        activities: Array.isArray(destination.activities)
          ? destination.activities.slice(0, 3).map(String)
          : [],
        accommodationPerPerson: accommodation,
        foodAndActivitiesPerPerson: foodAndActivities,
        members: calculatedMembers,
        consideration: String(destination.consideration || ""),
      };
    });

    // Keep recommendations as text for compatibility with your current UI.
    const recommendations = [
      "TripSync AI Recommendations",
      `Trip duration: ${days} days (${Math.max(0, days - 1)} nights).`,
      "All costs are approximate estimates, not live-verified.",
      "",
      ...destinations.flatMap((destination, index) => [
        `DESTINATION ${index + 1}: ${destination.name}`,
        `Why it suits the group: ${destination.whyItSuits}`,
        "",
        "Suggested activities:",
        ...destination.activities.map(
          (activity) => `- ${activity}`
        ),
        "",
        `Accommodation per person: ₹${destination.accommodationPerPerson}`,
        `Food and activities per person: ₹${destination.foodAndActivitiesPerPerson}`,
        "",
        "Member-wise budget breakdown:",
        ...destination.members.flatMap((member) => [
          `${member.name} (${member.city}, ${member.travelMode})`,
          `Transport: ₹${member.transport}`,
          `Accommodation: ₹${member.accommodation}`,
          `Food and activities: ₹${member.foodAndActivities}`,
          `Total: ₹${member.transport} + ₹${member.accommodation} + ₹${member.foodAndActivities} = ₹${member.total}`,
          `Individual budget: ₹${member.budget}`,
          member.status === "Over budget"
            ? `Status: OVER BUDGET by ₹${Math.abs(member.remaining)}`
            : `Status: Within budget; ₹${member.remaining} remaining`,
          "",
        ]),
        `Things to consider: ${destination.consideration}`,
        "",
        "----------------------------------------",
        "",
      ]),
    ].join("\n");

    return res.json({
      success: true,
      recommendations,
      tripDetails: {
        tripDays: days,
        averageBudget,
        members: safeMembers,
      },
      destinations,
    });
  } catch (error) {
    console.error("AI recommendation error:", error.message);
    console.error("Error status:", error.status);
    console.error("Error code:", error.code);

    return res.status(500).json({
      success: false,
      message: "Unable to generate recommendations right now.",
    });
  }
});

module.exports = router;
