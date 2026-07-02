const Election = require('../models/Election');

exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    elections.forEach(e => e.refreshStatus());
    res.json(elections);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getElectionById = async (req, res) => {
  try {
    const e = await Election.findById(req.params.id);
    if (!e) return res.status(404).json({ message: 'Election not found' });
    e.refreshStatus();
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.castVote = async (req, res) => {
  const { candidateId } = req.body;
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    election.refreshStatus();
    if (election.status !== 'ongoing')
      return res.status(400).json({ message: 'Election is not active' });
    if (election.votes.find(v => v.voter.toString() === req.user._id.toString()))
      return res.status(400).json({ message: 'You have already voted in this election' });
    election.votes.push({ voter: req.user._id, candidateId });
    const candidate = election.candidates.id(candidateId);
    if (candidate) candidate.votes += 1;
    await election.save();
    res.json({ message: 'Vote cast successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyVotes = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const myVotes = election.votes.filter(v => v.voter.toString() === req.user._id.toString());
    const result = myVotes.map(v => ({
      candidate: election.candidates.id(v.candidateId),
      votedAt: v.votedAt,
      electionTitle: election.title,
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    election.refreshStatus();
    if (election.status !== 'completed')
      return res.status(400).json({ message: 'Results available after election ends' });
    const sorted = [...election.candidates].sort((a, b) => b.votes - a.votes);
    const results = sorted.map(c => ({
      candidate: { _id: c._id, name: c.name, avatar: c.avatar, manifesto: c.manifesto },
      votes: c.votes,
    }));
    res.json({ election: { _id: election._id, title: election.title }, results });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
