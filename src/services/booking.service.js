const { BookingRepository } = require("../repository/index.repository");
const { ServiceError } = require("../utils/index.util").errorHandler;
const { FLIGHT_SERVICE_URL } = require("../config/serverConfig");
const { axios } = require("../utils/imports.util");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async create(data) {
    try {
      // Get the flight details
      const flightId = data.flightId;
      if (!flightId) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          "FlightId is missing"
        );
      }
      const getFlightRequestUrl = `${FLIGHT_SERVICE_URL}/api/v1/flights/${flightId}`;
      const flightResponse = await axios.get(getFlightRequestUrl);
      const flight = flightResponse.data.data;
      const priceOfTheFlight = flight.price;

      // Check if the no of seats requested is greater than the available seats
      if (data.noOfSeats > flight.availableSeats) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          "No of seats requested is greater than available seats"
        );
      }
      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = {
        ...data,
        totalCost,
      };

      // Create the booking
      const booking = await this.bookingRepository.create(bookingPayload);

      // Update the available seats in the flight
      const updateFlightRequestUrl = `${FLIGHT_SERVICE_URL}/api/v1/flights/${booking.flightId}`;
      await axios.patch(updateFlightRequestUrl, {
        availableSeats: flight.availableSeats - data.noOfSeats,
      });

      // Update the booking status
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });

      return finalBooking;
    } catch (error) {
      console.log(error, "Error in booking service");

      if (error instanceof ServiceError) {
        throw error;
      }

      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }

      throw new ServiceError();
    }
  }

  async destroy(bookingId) {
    try {
      const booking = await this.bookingRepository.destroy(bookingId);
      return booking;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookingService;
