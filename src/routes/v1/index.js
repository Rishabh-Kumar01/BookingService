const router = require("../../utils/imports.util").express.Router();
const { BookingController } = require("../../controllers/index.controller");
const { BookingMiddleware } = require("../../middlewares/index.middleware");
// const { createChannel } = require("../../utils/index.util").messageQueue;

// const channel = await createChannel();
const bookingController = new BookingController();

router.post(
  "/bookings",
  BookingMiddleware.validateCreateBooking,
  bookingController.create
);

router.post("/publish", bookingController.sendMessageToQueue);

router.delete("/bookings/:bookingId", bookingController.destroy);

router.get("/bookings/:userId", bookingController.getBookingsByUserId);
module.exports = router;
