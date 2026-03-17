const mongoose = require('mongoose');
const LegalPolicy = require('./models/LegalPolicy'); 

// MONGO_URI variable use karenge taaki Render par Atlas se connect ho sake
// Aur local par chalane ke liye backup mein localhost rakha hai
const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/searchkaro";

mongoose.connect(dbURI)
  .then(async () => {
    console.log("🚀 Database connected for seeding...");
    
    // Purana data delete karein taaki duplication na ho
    await LegalPolicy.deleteMany({}); 

    // Naya data insert karein
    await LegalPolicy.create([
      { 
        question: "Privacy Policy", 
        answer: "Hum aapka data Nagpur local laws ke mutabiq secure rakhte hain aur kisi third party ko nahi dete." 
      },
      { 
        question: "Terms of Service", 
        answer: "SearchKaro App ka istemal sirf valid business listings aur reviews ke liye kiya ja sakta hai." 
      },
      { 
        question: "Security Standards", 
        answer: "Aapka account encrypted hai aur hum regular security audits karte hain." 
      }
    ]);

    console.log("✅ Policies successfully upload ho gayi hain!");
    process.exit();
  })
  .catch(err => {
    console.log("❌ Seed Error:", err);
    process.exit(1);
  });