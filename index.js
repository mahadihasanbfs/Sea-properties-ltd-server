const express = require("express");
const app = express();
const path = require("path");
const port = 5001;
const cors = require("cors");
const auth_controller = require("./Modules/Authentication/AthenticationRouter");
const admin_controller = require("./Router/AdminRouter");
const user_controller = require("./Router/UserController");
const image_controller = require("./Modules/Image/ImageRouter");
// const AuthRouter = require('./Modules/Auth/AuthRouter');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
});

// API version 1 routes
app.get("/api/v1/", (req, res) => {
      res.send("Welcome to Sea Properties LTD API version 1!");
});

app.use("/api/v1/users", auth_controller);
app.use("/api/v1/admin", admin_controller);
app.use("/api/v1/image", image_controller);
app.use("/api/v1/user", user_controller);

// Error Handling Middleware
app.use((req, res, next) => {
      res.status(404).json({
            success: false,
            message: "Not Found the API",
            errorMessages: [
                  {
                        path: req.originalUrl,
                        message: "API Not Found",
                  },
            ],
      });
      next();
});

app.use((err, req, res, next) => {
      if (err instanceof Error) {
            const message = err.message;
            const errorMessages = message
                  ? [
                        {
                              path: "",
                              message,
                        },
                  ]
                  : [];

            console.error("Global Error Handler: ", err);

            res.status(500).json({
                  status: false,
                  message: "An error occurred",
                  errors: errorMessages,
            });
      } else {
            next(err);
      }
});

app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
});
