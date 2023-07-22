const express = require('express')
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

//My routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute")


//DB connection:
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser : true,
   useUnifiedTopology: true,
  useCreateIndex : true
}).then(() => {
  console.log("db connected succesfully")
}).catch(err => console.log(err))

//middlewares: 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes: 
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", paymentRoutes)

//serve static assets if in production

//SET STATIC FOLDER
app.use(express.static('client/build'));

app.get("/rohan", (req, res) => {

})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

//PORT
const port = process.env.PORT || 8080;

//strting server
app.listen(port, () => {
  console.log(`app is running at ${port}`)
})
