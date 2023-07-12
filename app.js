const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const paginate = require("express-paginate");
const { body, validationResult } = require("express-validator");

mongoose.connect("mongodb://localhost:27017/medicalstore", {
  useNewUrlParser: true,
});
let db = mongoose.connection;

db.on("error", function (err) {
  console.log(err);
});

db.once("open", function () {
  console.log("connected to mongodb");
});

const app = express();

app.use(paginate.middleware(3, 50));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  var pathname = req.url;

  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

  next();
});

app.use(function (req, res, next) {
  if (req.session.username) {
    return next();
  } else {
    if (req.path === "/user/login") {
      next();
    } else if (req.path === "/signup") {
      return next();

      res.render("signup");
    } else {
      return res.redirect("/user/login");
    }
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);

app.use(function (req, res, next) {
  res.locals.messages = require("express-messages", (req, res));
  next();
});

let Medicine = require("./models/medicineSchema.js");
let User = require("./models/userSchema.js");
var { ObjectId } = require("mongodb");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/home", async function (req, res) {
  const loggedUsername = req.session.username;
  res.render("home", {
    title: "Home page",
    username: loggedUsername,
  });
});

app.get("/medicine/list", async (req, res) => {
  const [results, itemCount] = await Promise.all([
    Medicine.find({}).limit(req.query.limit).skip(req.skip),
    Medicine.count({}),
  ]);
  const pageCount = Math.ceil(itemCount / req.query.limit);
  res.status(200).render("index", {
    title: "Medicines",
    medicines: results,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
  });
});

app.get("/medicine/add", function (req, res) {
  res.render("add", {
    title: "Add Medicine",
  });
});

app.post(
  "/medicine/add",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("expdate").notEmpty().withMessage("expdate is required"),
    body("price").notEmpty().withMessage("price is required"),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let medicine = new Medicine();
    medicine.name = req.body.name;
    medicine.description = req.body.description;
    medicine.expdate = req.body.expdate;
    medicine.price = req.body.price;

    try {
      await medicine.save();
      req.flash("success", "Medicine Added");
      res.redirect("/medicine/list");
    } catch (err) {
      console.error(err);
      res.status(500).send("internal server error");
    }
  }
);

app.get("/medicine/:id", async function (req, res) {
  try {
    let medicine = await Medicine.findById(req.params.id).exec();
    res.render("medicine", {
      medicine: medicine,
    });
  } catch (err) {
    // Handle the error appropriately
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/medicine/edit/:id", async function (req, res) {
  try {
    let medicine = await Medicine.findById(req.params.id).exec();
    res.render("edit", {
      title: "Edit",
      medicine: medicine,
    });
  } catch (err) {
    // Handle the error appropriately
    console.error(err);
  }
});

app.post("/medicine/edit/:id", async function (req, res) {
  let medicine = {};
  medicine.name = req.body.name;
  medicine.description = req.body.description;
  medicine.price = req.body.price;
  medicine.expdate = req.body.expdate;

  let query = { _id: req.params.id };

  await Medicine.findOneAndUpdate(query, medicine)
    .then(function () {
      req.flash("success", "Medicine Updated");
      res.redirect("/medicine/list");
    })
    .catch(function (err) {
      console.error(err);
      res.status(500);
    });
});

app.get("/medicine/delete/:id", async function (req, res) {
  let id = req.params.id;
  try {
    await Medicine.findOneAndDelete({ _id: id });
    res.redirect("/medicine/list");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

app.get("/medicine/search/:key", async (req, res) => {
  try {
    const data = await Medicine.find({
      name: { $regex: new RegExp(req.query.key, "i") },
    });

    console.log(data);

    res.render("search-results", { medicines: data });
  } catch (error) {
    console.error(error);
    res.render("error", { error: "An error occurred" });
  }
});

app.get("/user/login", function (req, res) {
  res.render("login");
});

app.get("/user/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/user/login");
  });
});

app.post("/user/login", async function (req, res) {
  try {
    let query = { username: req.body.username, password: req.body.password };

    let user = await User.findOne(query).exec();
    if (user) {
      req.session.username = user.username;
      res.redirect("/home");
    } else {
      req.flash("danger", "Invalid Login");
      res.render("login");
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  await User.insertMany([data]);
  res.redirect("/home");
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
