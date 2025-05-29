import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/random", async (req, res) => {
  try {
    const response = await axios.get("http://api.quotable.io/random");
    console.log("✅ External quote API response:", response.data);
    res.json(response.data);
  } catch (err: any) {
    console.error("❌ Error fetching quote:", err.message);
    if (err.response) {
      console.error("💥 Response data:", err.response.data);
      console.error("💥 Response status:", err.response.status);
    }
    res.status(500).json({ message: "Failed to fetch quote", error: err.message });
  }
});


export default router;
