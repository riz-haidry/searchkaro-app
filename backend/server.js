const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// --- MODELS IMPORT ---
const User = require('./models/User'); 
const Category = require('./models/Category');
const Location = require('./models/Location');
const Rating = require('./models/Rating');
const LegalPolicy = require('./models/LegalPolicy');

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/searchkaro";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ DB Connection Error:", err));

  app.get('/', (req, res) => res.send("SearchKaro API is running live!"));
// --- AUTH ROUTES ---
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Signup successful!" });
    } catch (err) { res.status(500).json({ message: "Signup failed" }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found!" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "nagpur_secret_key", { expiresIn: '24h' });
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        res.json({ 
            token, 
            user: { 
                name: user.name, 
                email: user.email, 
                role: "Java Developer" 
            } 
        });
    } catch (err) { res.status(500).json({ message: "Login error" }); }
});


// --- DYNAMIC DATA ROUTES ---


app.get('/api/search', async (req, res) => {
    try {
        const { q, loc } = req.query;
        console.log("🔍 Search Request Received:", { q, loc }); 

        let queryObj = {};

        if (q) {
            queryObj.$or = [
                { categoryName: new RegExp(q, 'i') },
                { product: new RegExp(q, 'i') },
                { role: new RegExp(q, 'i') }
            ];
        }

        if (loc) {
            queryObj.location = new RegExp(loc, 'i');
        }

        const results = await Category.find(queryObj).limit(20);
        console.log("✅ Found Results:", results.length);
        res.json(results);
    } catch (err) {
        console.error("❌ Search Error:", err);
        res.status(500).json({ message: "Search failed" });
    }
});

// 2. CATEGORIES CRUD
app.get('/api/categories', async (req, res) => {
    try {
        const data = await Category.find();
        res.json(data);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/categories', async (req, res) => {
    try {
        const newCat = new Category(req.body);
        await newCat.save();
        res.status(201).json({ message: "Category Added!", category: newCat });
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category deleted successfully!" });
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

// 3. LOCATIONS CRUD
app.get('/api/locations', async (req, res) => {
    try {
        const data = await Location.find();
        res.json(data);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/locations', async (req, res) => {
    try {
        const newLoc = new Location(req.body);
        await newLoc.save();
        res.status(201).json({ message: "Location Added!", location: newLoc });
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/locations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Location.findByIdAndDelete(id);
        res.json({ message: "Location deleted successfully!" });
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

// 4. RATINGS CRUD
app.get('/api/ratings', async (req, res) => {
    try {
        const data = await Rating.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/ratings', async (req, res) => {
    try {
        const newRating = new Rating(req.body);
        await newRating.save();
        res.status(201).json({ message: "Rating added!", rating: newRating });
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/ratings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Rating.findByIdAndDelete(id);
        res.json({ message: "Rating deleted successfully!" });
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});



// 5. REPORTS SUMMARY (Optimized for Sentiment Circle Chart)
app.get('/api/reports/summary', async (req, res) => {
    try {
       
        const [totalCategories, totalLocations, totalRatings, positiveRatings] = await Promise.all([
            Category.countDocuments(),
            Location.countDocuments(),
            Rating.countDocuments(),
            Rating.countDocuments({ review: true }) 
        ]);
        
        const latestRatings = await Rating.find().sort({ createdAt: -1 }).limit(5);

        // Frontend data Circle Graph 
        res.json({
            stats: { 
                totalCategories, 
                totalLocations, 
                totalRatings, 
                positiveRatings,
                negativeRatings: totalRatings - positiveRatings 
            },
            latestRatings
        });
    } catch (err) { 
        console.error("Report Error:", err);
        res.status(500).json({ message: "Report fetch error" }); 
    }
});



// 6. LEGAL POLICIES
app.get('/api/legal-policies', async (req, res) => {
    try {
        const data = await LegalPolicy.find().sort({ createdAt: 1 });
        res.json({ success: true, legalPolicies: data });
    } catch (err) { res.status(500).json({ success: false, message: "Legal fetch error" }); }
});

// Seed Route (Existing)
app.post('/api/legal-policies/seed', async (req, res) => {
    try {
        await LegalPolicy.deleteMany({}); 
        const professionalPolicies = [
            { question: "Privacy Policy?", answer: "Data secure as per Nagpur guidelines." },
            { question: "Terms?", answer: "Use for genuine business only." },
            { question: "Reporting?", answer: "Flag fake content in reports section." },
            { question: "Security?", answer: "JWT & industry standard encryption used." },
            { question: "Verification?", answer: "Each shop is manually verified." }
        ];
        await LegalPolicy.insertMany(professionalPolicies);
        res.json({ message: "Policies seeded successfully!" });
    } catch (err) { res.status(500).json({ message: "Seed failed" }); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));