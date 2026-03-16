const express = require("express");
const hostrouter = express.Router();
const Cars = require("../models/cars");
const { isLoggedIn } = require("../middleware");
const carController = require("../controllers/hostcontroller");
const upload = require("../init/multerconfig");

hostrouter.get("/cars", carController.getCars);

hostrouter.get("/car/:id", carController.getCarDetails);

hostrouter.get("/newcar", isLoggedIn, carController.addNewCar);

hostrouter.post(
  "/newcar",
  upload.single("car_image"),
  carController.newCarAdded,
);

hostrouter.get("/editcar/:id", isLoggedIn, carController.editCar);

hostrouter.put(
  "/editcar/:id",
  upload.single("car_image"),
  carController.carEditted,
);

hostrouter.post("/car/:id", isLoggedIn, carController.destroyCar);

hostrouter.get("/book/:id", isLoggedIn, carController.bookCar);

hostrouter.post("/book/:id", carController.carBooked);

hostrouter.get("/mybookings", isLoggedIn, carController.myBookings);

hostrouter.post("/cancelbooking/:id", carController.cancelBooking);

hostrouter.get("/profile", isLoggedIn, carController.getProfile);

hostrouter.post("/profile", isLoggedIn, carController.updateProfile);

module.exports = hostrouter;
