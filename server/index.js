const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🟢 CLEANUP: Removed duplicated middleware declarations to optimize pipeline performance
app.use(cors());
app.use(express.json());

// 🚀 Link Auth & Operational Component Routes 
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/ai', require('./routes/ai'));
app.use('/api/video', require('./routes/video'));
app.use('/api/sandbox', require('./routes/sandbox'));

// Local Database connection string targeting your sandbox instance
const mongoURI = "mongodb://127.0.0.1:27017/lingopax_mona";

mongoose.connect(mongoURI)
  .then(() => {
    console.log('🎉 MongoDB Database Connected Successfully!');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

app.get('/', (req, res) => {
  res.send('LingoPax Backend Server is Running! 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is happily running on port ${PORT}`);
});