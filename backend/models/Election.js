const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  manifesto: { type: String, default: '' },
  avatar:    { type: String, default: '' },
  votes:     { type: Number, default: 0 },
});

const voteSchema = new mongoose.Schema({
  voter:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  votedAt:     { type: Date, default: Date.now },
});

const electionSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  type:       { type: String, enum: ['University Level','Department Level'], required: true },
  department: { type: String, default: 'All' },
  startDate:  { type: Date, required: true },
  endDate:    { type: Date, required: true },
  status:     { type: String, enum: ['upcoming','ongoing','completed'], default: 'upcoming' },
  candidates: [candidateSchema],
  votes:      [voteSchema],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

electionSchema.methods.refreshStatus = function () {
  const now = new Date();
  if (now < this.startDate)       this.status = 'upcoming';
  else if (now <= this.endDate)   this.status = 'ongoing';
  else                            this.status = 'completed';
};

module.exports = mongoose.model('Election', electionSchema);
