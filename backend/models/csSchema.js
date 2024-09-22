const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const csSchema = new Schema({
  name: { type: String, required: true },
});

const Cs = mongoose.model('Cs', csSchema);

module.exports = Cs;
