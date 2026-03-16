const Cars = require("../models/cars");
const cloudinary = require("../init/cloudinaryconfig");
const Booking = require("../models/booking");
const User = require("../models/user");

module.exports.getCars = async (req, res, next) => {
  try {
    let query = {};
    let sortOption = {};

    // Search by car name
    if (req.query.search && req.query.search.trim()) {
      query.car_name = { $regex: req.query.search, $options: "i" };
    }

    // Filter by condition
    if (req.query.condition && req.query.condition !== "all") {
      query.condition = req.query.condition;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Sort option
    const sortBy = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    switch (sortBy) {
      case "name":
        sortOption = { car_name: sortOrder };
        break;
      case "price":
        sortOption = { price: sortOrder };
        break;
      case "condition":
        // Custom sort for condition (Excellent > Very Good > Good)
        sortOption = { car_name: sortOrder };
        break;
      default:
        sortOption = { car_name: 1 };
    }

    let cars = await Cars.find(query).sort(sortOption);

    // Custom sorting for condition
    if (sortBy === "condition") {
      const conditionOrder = { Excellent: 0, "Very Good": 1, Good: 2 };
      cars.sort((a, b) => {
        const orderA = conditionOrder[a.condition] || 999;
        const orderB = conditionOrder[b.condition] || 999;
        return sortOrder === 1 ? orderA - orderB : orderB - orderA;
      });
    }

    res.render("carsdisp", {
      cars: cars,
      search: req.query.search || "",
      condition: req.query.condition || "all",
      minPrice: req.query.minPrice || "",
      maxPrice: req.query.maxPrice || "",
      sortBy: sortBy,
      sortOrder: req.query.sortOrder || "asc",
    });
  } catch (err) {
    console.log("Error in getCars:", err);
    res.render("carsdisp", { cars: [] });
  }
};

module.exports.getCarDetails = async (req, res) => {
  const { id } = req.params;
  const car = await Cars.findById(id).populate("owner");
  console.log(car);
  res.render("cardet", { car: car });
};

module.exports.addNewCar = (req, res, next) => {
  res.render("newcar");
};

module.exports.newCarAdded = async (req, res, next) => {
  try {
    const { car_name, condition, seats, fuel_type, price } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      req.flash("error", "Please upload an image");
      return res.redirect("/host/newcar");
    }

    // Upload to cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "carnow/cars",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(req.file.buffer);
    });

    const newCar = new Cars({
      car_name,
      condition,
      seats,
      fuel_type,
      image_url: result.secure_url,
      price,
    });
    newCar.owner = req.user._id;

    await newCar.save();
    console.log("Car registered");
    req.flash("success", "New car registered");
    res.redirect("/host/cars");
  } catch (err) {
    console.log("error in saving the car", err);
    req.flash("error", "Error uploading image or registering car");
    res.redirect("/host/newcar");
  }
};

module.exports.editCar = async (req, res, next) => {
  const { id } = req.params;
  const carEdit = await Cars.findById(id);
  res.render("edit", { carEdit: carEdit });
};

module.exports.carEditted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { car_name, condition, seats, fuel_type, price } = req.body;

    const updateData = {
      car_name,
      condition,
      seats,
      fuel_type,
      price,
    };

    // If a new image is uploaded, upload it
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "carnow/cars",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });
      updateData.image_url = result.secure_url;
    }

    await Cars.findByIdAndUpdate(id, updateData);
    req.flash("success", "Car details updated");
    res.redirect("/host/cars");
  } catch (err) {
    console.log("error in updating the car", err);
    req.flash("error", "Error updating car");
    res.redirect("/host/cars");
  }
};

module.exports.destroyCar = async (req, res, next) => {
  const { id } = req.params;
  await Cars.findByIdAndDelete(id);
  res.redirect("/host/cars");
};

module.exports.bookCar = async (req, res, next) => {
  const { id } = req.params;
  const car = await Cars.findById(id);
  res.render("book", { car: car });
};

module.exports.carBooked = async (req, res, next) => {
  const { id } = req.params;
  const { start_date, end_date } = req.body;
  const bookedCar = await Cars.findById(id);
  const total_price =
    bookedCar.price *
    ((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
  const newBooking = new Booking({
    car: bookedCar._id,
    user: req.user._id,
    start_date,
    end_date,
    total_price,
  });
  await newBooking.save();
  req.flash("success", "Car booked successfully");
  res.redirect("/host/mybookings");
};

module.exports.myBookings = async (req, res, next) => {
  const bookedCars = await Booking.find({ user: req.user._id })
    .populate("car")
    .populate("user");
  res.render("mybookings", { bookedCars, user: req.user, currUser: req.user });
};
module.exports.cancelBooking = async (req, res, next) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled successfully");
  res.redirect("/host/mybookings");
};

module.exports.getProfile = async (req, res, next) => {
  const user = req.user;
  res.render("profile", { user });
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { address, latitude, longitude } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address: address || "Not specified",
        latitude: parseFloat(latitude) || 28.6139,
        longitude: parseFloat(longitude) || 77.209,
      },
      { new: true },
    );

    req.flash("success", "Profile updated successfully");
    res.redirect("/host/profile");
  } catch (err) {
    console.log("Error updating profile:", err);
    req.flash("error", "Error updating profile");
    res.redirect("/host/profile");
  }
};
