const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());


// Define Routes

app.use('/api/users', require('./routes/api/users'))

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/food', require('./routes/api/food'));
app.use('/api/meal', require('./routes/api/meal'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/dietprofile', require('./routes/api/dietprofile'));

app.use('/api/goal', require('./routes/api/goal'));
app.use('/api/fDiary', require('./routes/api/fDiary'));
app.use('/api/sport', require('./routes/api/sport'));
app.use('/api/exercise', require('./routes/api/exercise'));
app.use('/api/sDiary', require('./routes/api/sDiary'));

app.use('/api/mealSuggestion', require('./routes/api/mealSuggestion'));
app.use('/api/completedMeals', require('./routes/api/completedMeals'));


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
