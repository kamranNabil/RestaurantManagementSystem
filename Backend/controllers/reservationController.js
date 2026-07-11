const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

const createReservation = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.body;

    const availableTable = await Table.findOne({
      capacity: { $gte: guests },
      isActive: true,
      _id: {
        $nin: await Reservation.find({ date, timeSlot, status: 'active' }).distinct('table')
      }
    });

    if (!availableTable) {
      return res.status(400).json({ message: 'No available table for the selected date, time and guests' });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      table: availableTable._id,
      date,
      timeSlot,
      guests,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('table', 'tableNumber capacity')
      .sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user.id });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const filter = { status: 'active' };
    if (req.query.date) filter.date = req.query.date;

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { date, timeSlot, guests, table } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const newDate = date || reservation.date;
    const newTimeSlot = timeSlot || reservation.timeSlot;
    const newGuests = guests || reservation.guests;
    const newTable = table || reservation.table;

    const targetTable = await Table.findById(newTable);
    if (!targetTable) return res.status(404).json({ message: 'Table not found' });

    if (targetTable.capacity < newGuests) {
      return res.status(400).json({ message: 'Table capacity insufficient for the number of guests' });
    }

    const conflict = await Reservation.findOne({
      _id: { $ne: req.params.id },
      table: newTable,
      date: newDate,
      timeSlot: newTimeSlot,
      status: 'active'
    });

    if (conflict) {
      return res.status(400).json({ message: 'Table already booked for that date and time slot' });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { date: newDate, timeSlot: newTimeSlot, guests: newGuests, table: newTable },
      { new: true }
    ).populate('user', 'name email').populate('table', 'tableNumber capacity');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelAnyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled by admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  updateReservation,
  cancelAnyReservation
};