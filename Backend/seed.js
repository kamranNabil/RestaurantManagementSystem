const mongoose = require('mongoose');
const Table = require('./models/Table');
require('dotenv').config();

const tables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 6 },
  { tableNumber: 6, capacity: 6 },
  { tableNumber: 7, capacity: 8 },
  { tableNumber: 8, capacity: 8 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Table.deleteMany();
  await Table.insertMany(tables);
  console.log('Tables seeded!');
  process.exit();
};

seed();