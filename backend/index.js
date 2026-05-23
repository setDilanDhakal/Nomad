import app from "./app.js";

import connectDB from "./configs/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running at", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });