const express = require('express');
const router = express.Router();

const { InfoController } = require('../../controllers');
const BookingRoutes = require('./booking-routes');

router.get('/info', InfoController.info);
router.use('/bookings',BookingRoutes);

module.exports = router;