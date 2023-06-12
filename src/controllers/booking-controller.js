const {BookingService} = require('../services');
const { ErrorResponse , SuccesResponse } = require('../utils/common');
const {StatusCodes} = require('http-status-codes');


async function createBooking(request,response){
try {
    console.log(request.body);
    const res = await BookingService.createBooking({
        flightId: request.body.flightId,
        userId : request.body.userId,
        noofSeats : request.body.noOfSeats,
    });
    SuccesResponse.data= res;
    return response
    .status(StatusCodes.OK)
    .json(SuccesResponse);
} catch (error) {
    ErrorResponse.error = error;
    return response
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(ErrorResponse);
}

}

async function updatePayment(request,response){
try {
    const res = await BookingService.updatePayment({
        bookingId: request.body.bookingId,
        userId : request.body.userId,
        totalCost : request.body.totalCost,
    });
    SuccesResponse.data= res;
    return response
    .status(StatusCodes.OK)
    .json(SuccesResponse);
} catch (error) {
    ErrorResponse.error = error;
    return response
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(ErrorResponse);
}

}



module.exports = {
    createBooking,
    updatePayment,
}