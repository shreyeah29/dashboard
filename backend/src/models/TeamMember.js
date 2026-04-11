const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
