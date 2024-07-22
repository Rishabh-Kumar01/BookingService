const router = require("../../utils/imports.util").express.Router();
const { BookingController } = require("../../controllers/index.controller");
const { BookingMiddleware } = require("../../middlewares/index.middleware");

// Create the bookingController instance
const bookingController = BookingController.getInstance();

// Define the routes
router.post(
  "/bookings",
  BookingMiddleware.validateCreateBooking,
  bookingController.create
);

router.delete("/bookings/:bookingId", bookingController.destroy);

router.get("/bookings/:userId", bookingController.getBookingsByUserId);

// Export a function that sets up the channel and returns the router
module.exports = (channel) => {
  // Set the channel in the bookingController
  bookingController.setChannel(channel);

  return router;
};
