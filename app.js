const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", require("./routes/users-router"));
app.use("/api/posts", require("./routes/posts-router"));
app.use("/api/activities-permission", require("./routes/activities-permissions-router"));
app.use("/api/candidates", require("./routes/candidates-router"));
app.get('/', (req, res) => {
  res.send({ message: "Welcome to voting system APIs" });
});
app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(3003, () => {
  console.log("server is running on http://localhost:3003");
});
