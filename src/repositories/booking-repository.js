const { statusCodes } =require('http-status-codes');

const { Booking } =require('../models');
const { CrudRepository } = require('.');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

}

module.exports = BookingRepository;