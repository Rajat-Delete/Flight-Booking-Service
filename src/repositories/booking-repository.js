const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models');
const CrudRepository = require('./crud-repository');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction){
        const response  = await Booking.create(data , {transaction : transaction});
        return response;
    }

    //overriding the implementation of get method as per transaction basis
    async get(data, transaction) {
        const response = await this.model.findByPk(data, {transaction :transaction});
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    //overriding the implementation of update method as per transaction basis
    async update(id, data, transaction) { // data -> {col: value, ....}
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, {transaction : transaction});
        return response;
    }

}

module.exports = BookingRepository;