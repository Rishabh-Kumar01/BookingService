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

module.exports = {
  create,
  destroy,
};
