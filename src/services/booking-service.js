const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');

const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const bookingRepository = new BookingRepository();

async function createBooking(data){
 
    const transaction = await db.sequelize.transaction();
    try {
            console.log(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            console.log(data)
            const flightData = flight.data.data;
            if(data.noofSeats > flightData.totalSeats){
                throw new AppError('Explanation : Not Enough Seats available for Booking', StatusCodes.BAD_REQUEST);
            }
            const totalBillingAmount = data.noofSeats * flightData.price;
            console.log(totalBillingAmount);
            // ...data is spread operator in ES6 , it will bind and create a new object
            const bookingPayload = { ...data , totalCost : totalBillingAmount};
            console.log(bookingPayload);
            const booking = bookingRepository.createBooking(bookingPayload , transaction);
            console.log(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats`);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats` , {
                 seats : data.noofSeats
            });
            console.log('after axios call')
            
            await transaction.commit();
            
            return booking;

    } catch (error) {
        throw error;
    }        
        
}



module.exports = {
    createBooking,
}