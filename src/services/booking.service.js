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
      console.log(flight, "flight");
      if (!flight) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          `Flight with id ${flightId} not found`
        );
      }
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

      if (!booking) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          "The booking could not be created"
        );
      }

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
      // Check if the booking exists
      const booking = await this.bookingRepository.findOne(bookingId);

      if (!booking) {
        throw new ServiceError(
          "Booking not found",
          "The booking you are trying to delete does not exist"
        );
      }

      // Delete the booking
      const bookingDeleted = await this.bookingRepository.destroy(bookingId);

      if (!bookingDeleted) {
        throw new ServiceError(
          "Something went wrong in the booking deletion process",
          "The booking could not be deleted"
        );
      }

      // Update the available seats in the flight
      const getFlightRequestUrl = `${FLIGHT_SERVICE_URL}/api/v1/flights/${booking.flightId}`;
      const flightResponse = await axios.get(getFlightRequestUrl);
      const flight = flightResponse.data.data;

      const updateFlightRequestUrl = `${FLIGHT_SERVICE_URL}/api/v1/flights/${booking.flightId}`;
      await axios.patch(updateFlightRequestUrl, {
        availableSeats: flight.availableSeats + booking.noOfSeats,
      });

      return bookingDeleted;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async getBookingsByUserId(userId) {
    try {
      const bookings = await this.bookingRepository.findBookingsByUserId(
        userId
      );
      console.log(bookings, "bookings");
      if (!bookings) {
        throw new ServiceError(
          "Something went wrong in fetching the bookings",
          "The bookings could not be fetched"
        );
      }

      const flights = bookings.map((booking) => booking.flightId);
      const flightsData = [];
      const getFlightRequestUrl = `${FLIGHT_SERVICE_URL}/api/v1/flights`;

      for (let i = 0; i < flights.length; i++) {
        const flightResponse = await axios.get(
          `${getFlightRequestUrl}/${flights[i]}`
        );
        flightsData.push(flightResponse.data.data);
      }

      const userBookings = bookings.map((booking, index) => {
        return {
          flightName: flightsData[index].flightNumber,
          departureAirport: flightsData[index].departureAirport,
          arrivalAirport: flightsData[index].arrivalAirport,
          airplane: flightsData[index].airplane,
          departureTime: flightsData[index].departureTime,
          arrivalTime: flightsData[index].arrivalTime,
          noOfSeats: booking.noOfSeats,
          totalCost: booking.totalCost,
          status: booking.status,
        };
      });
      return userBookings;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
