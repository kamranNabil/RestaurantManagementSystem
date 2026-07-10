const Table = require('../models/Table');

const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({ message: 'Table removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllTables, addTable, updateTable, deleteTable };