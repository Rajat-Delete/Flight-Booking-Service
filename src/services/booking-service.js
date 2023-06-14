const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');

const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const {Enums} = require('../utils/common');
const {BOOKED , CANCELLED} = Enums.BOOKING_STATUS;
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
        transaction.rollback();
        throw error;
    }        
        
}

//this menthod is going to update the status of payment by checking the userId and amountId with the booking amount and booking userId present in our database.
async function updatePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const booking = await bookingRepository.get(data.bookingId);
        //if booking is already cancelled then throw a error
        if(booking.status == CANCELLED){
            throw new AppError('Explanation : The Booking is already Cancelled', StatusCodes.BAD_REQUEST);
        }

        //validating the time, if booking and payment time has difference of more the 5 mins then throw error and update booking to cancelled 
        const bookingTime = new Date(booking.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000){
            await cancelBooking(data.bookingId);
            throw new AppError('Explanation : The Booking is Expired', StatusCodes.BAD_REQUEST);
        }
        if(booking.totalCost != data.totalCost){
            throw new AppError('Explanation : The Amount of the Payment doesnot match.', StatusCodes.BAD_REQUEST);
        }
        if(booking.userId != data.userId){
            throw new AppError('Explanation : The user corresponding to the payment doesnot match', StatusCodes.BAD_REQUEST);
        }
        //we assume here everything is fine , so we will proceed with updating the status of booking to BOOKED
        const response = await bookingRepository.update(data.bookingId, {status : BOOKED}, transaction);

        await transaction.commit();
        return response;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId){
    const transaction =  await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId);
        console.log(bookingDetails);

        //checking if the booking is already cancelled then there is no need to cancel again
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${bookingDetails.flightId}/seats` , {
            seats : bookingDetails.noofSeats
        });

        await bookingRepository.update(bookingId, {status : CANCELLED}, transaction);
        await transaction.commit();        
    } catch (error) {
        await transaction.rollback();
        throw error;
    }


}

async function cancelOldBookings(){
    try {
        const time = new Date(Date.now() - 1000*300); // it will fetch the time 5 mins ago
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



module.exports = {
    createBooking,
    updatePayment,
    cancelOldBookings
}