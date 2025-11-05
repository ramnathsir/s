const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://ramnathsir095_db_user:Ramnath1234@face.uy009og.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Schema & Model
const attendanceSchema = new mongoose.Schema({
  name: String,
  roll: String,
  date: String,
  time: String,
  image: String
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// ✅ API: Save Attendance
app.post("/save-attendance", async (req, res) => {
  try {
    const { name, roll, date, time, image } = req.body;

    if (!name || !roll || !image) {
      return res.status(400).json({ error: "Missing data" });
    }

    const record = new Attendance({ name, roll, date, time, image });
    await record.save();

    res.json({ message: "Attendance saved successfully to MongoDB!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ API: Get All Attendance Records
app.get("/get-attendance", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ _id: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch records" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
