const { Booking } = require("../models/index");
const { ValidationError, AppError } =
  require("../utils/index.util").errorHandler;
const { StatusCodes } = require("../utils/imports.util").responseCodes;

class BookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create({
        flightId: data.flightId,
        userId: data.userId,
        noOfSeats: data.noOfSeats,
        totalCost: data.totalCost,
      });
      return booking;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Cannot create booking",
        "There was some issue while creating the booking. Please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(bookingId, data) {
    try {
      const booking = await Booking.findOne({
        where: {
          id: bookingId,
        },
      });
      booking.status = data.status;
      await booking.save();
      return booking;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Cannot create booking",
        "There was some issue while creating the booking. Please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async destroy(bookingId) {
    try {
      const booking = await Booking.destroy({
        where: {
          id: bookingId,
        },
      });
      return booking;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Cannot create booking",
        "There was some issue while creating the booking. Please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = BookingRepository;
