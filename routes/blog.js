const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer")
const path = require("path")

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
})

router.get('/:id', async(req, res) => {
    const id = req.params.id

    const blog = await Blog.findById(id).populate('createdBy')
    const comments = await Comment.find({ blogId: blog._id }).sort('-createdAt').populate('createdBy')

    return res.render('blog', {
        user: req.user,
        bloog: blog,
        comments: comments
    });
})

router.post('/', upload.single('coverimage'), async (req, res) => {
    const { title, body } = req.body

    const user = req.user
    const file = req.file

    const blog = await Blog.create({
        coverImageUrl: `/uploads/${file.filename}`,
        title,
        body,
        createdBy: user._id
    })

    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId', async(req, res) => {
    const { comment } = req.body
    const user = req.user

    await Comment.create({
        content: comment,
        blogId: req.params.blogId,
        createdBy: user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router;