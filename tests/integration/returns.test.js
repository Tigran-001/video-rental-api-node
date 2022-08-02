const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");

describe("api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = function () {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 20,
    });
    await movie.save();

    rental = new Rental({
      customer: { _id: customerId, name: "12345", phone: "12345" },
      movie: { _id: movieId, title: "12345", dailyRentalRate: 2 },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  test("should return 401 if a client is not logged in.", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  test("should return 400 if customer ID is not provided.", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test("should return 400 if movie ID is not provided.", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test("should return 404 if no rental is found for the customer/movie combination.", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  test("should return 400 if return is already processed.", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  test("should return 200 if request is valid.", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  test("should set the returnDate if an input is valid.", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    console.log(rentalInDb.dateReturned);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  test("should set the rentalFee if an input is valid.", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  test("should increase the movie stock if an input is valid.", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  test("should return the rental if an input is valid.", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
