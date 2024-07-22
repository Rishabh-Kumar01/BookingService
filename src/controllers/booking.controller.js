const { BookingService } = require("../services/index.services");
const { StatusCodes } = require("../utils/imports.util").responseCodes;

class BookingController {
  // constructor(channel) {
  //   this.bookingService = new BookingService(channel);
  //   // Bind the methods to ensure correct 'this' context
  //   // this.create = this.create.bind(this);
  //   // this.destroy = this.destroy.bind(this);
  //   // this.getBookingsByUserId = this.getBookingsByUserId.bind(this);
  // }

  constructor() {
    this.bookingService = null;
    this.create = this.create.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getBookingsByUserId = this.getBookingsByUserId.bind(this);
  }

  setChannel(channel) {
    this.bookingService = new BookingService(channel);
  }

  async create(req, res) {
    try {
      const token = req.headers["x-access-token"];
      const response = await this.bookingService.create(req.body, token);
      return res.status(StatusCodes.OK).json({
        message: "Booking created successfully",
        success: true,
        error: {},
        data: response,
      });
    } catch (error) {
      console.log(error, "Error in booking controller");
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || "Something went wrong",
          success: false,
          error: error.explanation || {},
          data: {},
        });
    }
  }

  async destroy(req, res) {
    try {
      const response = await this.bookingService.destroy(req.params.bookingId);
      return res.status(StatusCodes.OK).json({
        message: "Booking deleted successfully",
        success: true,
        error: {},
        data: response,
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || "Something went wrong",
          success: false,
          error: error.explanation || {},
          data: {},
        });
    }
  }

  async getBookingsByUserId(req, res) {
    try {
      const response = await this.bookingService.getBookingsByUserId(
        req.params.userId
      );
      return res.status(StatusCodes.OK).json({
        message: "Bookings fetched successfully",
        success: true,
        error: {},
        data:
          response.length === 0 ? "No bookings found for the user" : response,
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || "Something went wrong",
          success: false,
          error: error.explanation || {},
          data: {},
        });
    }
  }
}

module.exports = BookingController;
