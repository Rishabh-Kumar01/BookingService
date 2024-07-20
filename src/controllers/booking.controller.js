const { BookingService } = require("../services/index.services");
const { StatusCodes } = require("../utils/imports.util").responseCodes;
const { createChannel, publishMessage } =
  require("../utils/index.util").messageQueue;
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {
  constructor() {}

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const data = { message: "Sending a reminder to the user" };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(StatusCodes.OK).json({
      message: "Message sent to the queue",
      success: true,
      error: {},
      data: {},
    });
  }

  async create(req, res) {
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

  async destroy(req, res) {
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

  async getBookingsByUserId(req, res) {
    try {
      const response = await bookingService.getBookingsByUserId(
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
      return res.status(error.statusCode).json({
        message: error.message,
        success: false,
        error: error.explanation,
        data: {},
      });
    }
  }
}

module.exports = BookingController;
