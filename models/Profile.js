const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  titleAboutUser: {
    type: String
  },
  aboutMe: {
    type: String
  },
  inspirations: {
    type: String
  },
  location: {
    type: String
  },
  dietProfile: [
    {
      currentWeight: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      goalWeight: {
        type: Number,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      dateOfBirth: {
        type: Date,
        required: true
      },
      workoutWeek: {
        type: Number
      },
      workoutDay: {
        type: Number
      },
      goal: {
        type: String
      }
    }
  ],
  // education: [
  //   {
  //     school: {
  //       type: String,
  //       required: true
  //     },
  //     degree: {
  //       type: String,
  //       required: true
  //     },
  //     fieldofstudy: {
  //       type: String,
  //       required: true
  //     },
  //     from: {
  //       type: Date,
  //       required: true
  //     },
  //     to: {
  //       type: Date
  //     },
  //     current: {
  //       type: Boolean,
  //       default: false
  //     },
  //     description: {
  //       type: String
  //     }
  //   }
  // ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
