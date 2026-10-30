const mongoose = require('mongoose');

const STATUSES = ['todo', 'in-progress', 'done'];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, default: '', maxlength: 1000 },
    status: { type: String, enum: STATUSES, default: 'todo', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    deadline: { type: Date, default: null },
    order: { type: Number, default: 0 } // position inside a column
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
module.exports.STATUSES = STATUSES;