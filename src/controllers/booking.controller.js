const { BookingService } = require("../services/index.services");
const { StatusCodes } = require("../utils/imports.util").responseCodes;

const bookingService = new BookingService();

async function create(req, res) {
  try {
    const response = await bookingService.create(req.body);
    return res.status(StatusCodes.OK).json({
      message: "Booking created successfully",
      success: true,
      error: {},
      data: response,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
      error: error.explanation,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    const response = await bookingService.destroy(req.params.bookingId);
    return res.status(StatusCodes.OK).json({
      message: "Booking deleted successfully",
      success: true,
      error: {},
      data: response,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
      error: error.explanation,
      data: {},
    });
  }
}

const getBookingsByUserId = async (req, res) => {
  try {
    const response = await bookingService.getBookingsByUserId(
      req.params.userId
    );
    return res.status(StatusCodes.OK).json({
      message: "Bookings fetched successfully",
      success: true,
      error: {},
      data: response.length === 0 ? "No bookings found for the user" : response,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
      error: error.explanation,
      data: {},
    });
  }
};

module.exports = {
  create,
  destroy,
  getBookingsByUserId,
};
