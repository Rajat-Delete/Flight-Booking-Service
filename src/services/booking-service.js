const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');

const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

async function createBooking(data){
    return new Promise((resolve,reject)=>{
//since this is a callback function and will be executed at runtime so will bind in promise
        const result = db.sequelize.transaction(async function bookingImpl(t){
            console.log(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            // console.log('data.noofSeats')
            const flightData = flight.data.data;
            if(data.noOfSeats > flightData.totalSeats){
                reject( new AppError('Explanation : Not Enough Seats available for Booking', StatusCodes.BAD_REQUEST));
            }

            resolve(true);
    });
        
        })
}



module.exports = {
    createBooking,
}