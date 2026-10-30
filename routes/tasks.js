const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// GET /api/tasks?status=todo  -> list tasks (sorted by column order)
router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const tasks = await Task.find(filter).sort({ status: 1, order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
});

// POST /api/tasks -> create (placed at the end of its column)
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority, deadline } = req.body;
    const last = await Task.findOne({ status: status || 'todo' }).sort({ order: -1 });
    const task = await Task.create({
      title, description, status, priority,
      deadline: deadline || null,
      order: last ? last.order + 1 : 0
    });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

// PUT /api/tasks/reorder -> bulk save after drag & drop
// body: { items: [{ id, status, order }] }
router.put('/reorder', async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    await Task.bulkWrite(
      items.map(i => ({
        updateOne: { filter: { _id: i.id }, update: { $set: { status: i.status, order: i.order } } }
      }))
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// PUT /api/tasks/:id -> update any field
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'deadline'];
    const update = {};
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k] || (k === 'deadline' ? null : req.body[k]); });
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (e) { next(e); }
});

module.exports = router;