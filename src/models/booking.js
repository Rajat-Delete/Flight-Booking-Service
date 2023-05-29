'use strict';
const {
  Model
} = require('sequelize');
const { Enums } =require('../utils/common');
const { BOOKED , CANCELLED , PENDING , INITIATED } = Enums.BOOKING_STATUS;

const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    flightId: {
     type: DataTypes.INTEGER,
     allowNull : false,
    },
    userId: {
     type: DataTypes.INTEGER,
     allowNull : false,
    },
    noofSeats: {
      type: Sequelize.INTEGER,
      allowNull :false,
    },
    status: {
      type: DataTypes.ENUM,
      values : [BOOKED , CANCELLED , PENDING , INITIATED],
      defaultValue : PENDING,
      allowNull :false,
    },
    totalCost: {
     type: DataTypes.INTEGER,
     allowNull : false,
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};