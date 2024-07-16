const { StatusCodes } = require("../utils/imports.util").responseCodes;
const { AppError } = require("../utils/index.util").errorHandler;

const validateCreateBooking = (req, res, next) => {
  const { flightId, userId, noOfSeats } = req.body;
  if (!flightId || !userId || !noOfSeats) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid request body for creating booking",
      success: false,
      error: "Missing Mandatory Fields",
      data: {},
    });
  }
  next();
};

module.exports = {
  validateCreateBooking,
};
