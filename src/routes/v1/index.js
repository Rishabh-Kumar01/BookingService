const router = require("../../utils/imports.util").express.Router();
const { BookingController } = require("../../controllers/index.controller");
const { BookingMiddleware } = require("../../middlewares/index.middleware");

router.post(
  "/bookings",
  BookingMiddleware.validateCreateBooking,
  BookingController.create
);

router.delete("/bookings/:bookingId", BookingController.destroy);

router.get("/bookings/:userId", BookingController.getBookingsByUserId);
module.exports = router;
