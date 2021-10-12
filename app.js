const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes")
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')


const app = express();

// middleware
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://Ananya:chunchun8@cluster0.xhwif.mongodb.net/social-media-app?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('mongobd connected')
    app.listen(8000, () => {
      console.log("Listening at port 8000");
    })
  }
  )
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies",requireAuth ,(req, res) => res.render("smoothies"));
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes)