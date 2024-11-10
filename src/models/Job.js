// models/Job.ts

import mongoose from 'mongoose';



const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract'],
    
  },
  salary: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  poster: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
delete mongoose.connection.models['Job'];

export default Job;
