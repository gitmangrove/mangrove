const mongoose = require('mongoose');

module.exports = mongoose.model('Input', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  path: { type: String, required: true },
  site: { type: String, required: true },
  series: { type: String, required: true },
  name: { type: String, required: true },
  recordTimeMs: { type: Number, required: true },
  durationMs: { type: Number, required: true },
  sampleRateHz: { type: Number, required: true },
  sizeBytes: { type: Number, required: true },
  coords: {
    type: {
      lat: Number,
      long: Number,
    },
    required: true,
  },
}));
