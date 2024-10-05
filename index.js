const express = require("express")
const path = require("path")
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")
const { checkForAuthenticationCookie } = require("./middlewares/authentication")

const app = express();
const PORT = 9001

mongoose
    .connect('mongodb://localhost:27017/bloogify')
    .then((e) => console.log('mongodb connected'))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('bloogify'));
app.use(express.static(path.resolve("./public")))

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort('-createdAt')

    res.render("home", {
        user: req.user,
        bloogs: allBlogs
    })
});

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Server Started on PORT: ${PORT}`))