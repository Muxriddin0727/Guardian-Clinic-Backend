const { shapeIntoMongooseObjectId } = require("../../lib/config");
const Blog = require("../../models/Blog");
const blogModel = require("../../schema/blog.model");

let blogController = module.exports;

blogController.getAllBlogs = async (req, res) => {
  try {
    console.log("POST: client/getAllBlogs");
    const result = await blogModel.find({}).exec();
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getAllBlogs, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getSearch = async (req, res) => {
  try {
    console.log("POST: client/getSerchBlogs");
    const searchQuery = req.query.search;
    const blogs = await blogModel
      .find({ $text: { $search: searchQuery } })
      .exec();

    res.json({ state: "success", data: blogs });
  } catch (err) {
    console.log(`ERROR, client/getSerchBlogs, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getDoctorBlogs = async (req, res) => {
  try {
    let doctorId = req.params.id;
    doctorId = shapeIntoMongooseObjectId(doctorId);
    console.log("POST: client/getAllBlogs");

    const blogs = await blogModel.find({ doctor_mb_id: doctorId });
    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ state: "fail", message: "Blogs not found" });
    }
    res.json({ state: "success", data: blogs });
  } catch (err) {
    console.log(`ERROR, client/getAllBlogs, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getChosenBlog = async (req, res) => {
  try {
    console.log("GET: client/getChosenBlog ");
    const blog = new Blog();
    const id = req.params.id;
    const member = req.member || null; 
    const result = await blog.getChosenBlogsData(member, id);

    // Increment blog_views only if member is logged in
    if (member && member._id) {
      await blogModel.findByIdAndUpdate(id, {
        $push: { blog_views: member._id },
      });
    }

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getChosenBlog, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getBlogWithOwner = async (req, res) => {
  try {
    const blog = new Blog();
    const result = await blog.getBlogWithOwnerData(req.params.id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getBlogWithOwner, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.likeBlogChosen = async (req, res) => {
  try {
    const { blog_id, _id } = req.body;
    console.log("POST: client/likeBlogChosen");

    const found_blog = await blogModel.findById(blog_id);
    if (!found_blog) {
      console.log(`Blog not found with id: ${blog_id}`);
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (found_blog.blog_likes.includes(_id)) {
      found_blog.blog_likes = found_blog.blog_likes.filter((id) => id !== _id);
    } else {
      found_blog.blog_likes = [...found_blog.blog_likes, _id];
    }

    await blogModel.findByIdAndUpdate(found_blog._id, {
      blog_likes: found_blog.blog_likes,
    });

    res.json({ state: "success" });
  } catch (err) {
    console.log(`ERROR, client/likeBlogChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};


blogController.commentOnBlog = async (req, res) => {
  try {
    const { blog_id, _id, mb_name, comment_content, mb_image } = req.body;
    console.log("POST: client/commentOnBlog");

    const found_blog = await blogModel.findById(blog_id);
    if (!found_blog.blog_comments) {
      found_blog.blog_comments = [];
    }
    const newComment = {
      _id: shapeIntoMongooseObjectId(_id),
      mb_name: mb_name,
      comment_content: comment_content,
      mb_image: mb_image,
      posted_at: Date.now(),
    };
    found_blog.blog_comments.push(newComment);

    const updated_blog = await blogModel.findByIdAndUpdate(
      found_blog._id,
      {
        blog_comments: found_blog.blog_comments,
      },
      { new: true }
    );

    res.json({ state: "success", blog: updated_blog });
  } catch (err) {
    console.log(`ERROR, client/commentOnBlog, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getBlogComments = async (req, res) => {
  try {
    const { blog_id } = req.params;
    console.log("GET: client/blog-comments");

    const found_blog = await blogModel.findById(blog_id);
    if (!found_blog) {
      return res.status(404).json({ state: "fail", message: "Blog not found" });
    }

    res.json({ state: "success", comments: found_blog.blog_comments });
  } catch (err) {
    console.log(`ERROR, client/blog-comments, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getBlogsLikedByUser = async (req, res) => {
  try {
    console.log("GET: client/getBlogsLikedByUser");
    const { id } = req.params; // get id from request params
    console.log("id: ", id);

    // Find all blogs where the user is in the blog_likes array
    const likedBlogs = await blogModel.find({
      blog_likes: id,
    });

    if (!likedBlogs)
      return res
        .status(404)
        .json({ message: "No blogs found liked by this user" });

    res.json({ state: "success", blogs: likedBlogs });
  } catch (err) {
    console.log(`ERROR, client/getBlogsLikedByUser, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.viewBlogChosen = async (req, res) => {
  try {
    const { blog_id, _id } = req.body;
    console.log("POST: client/viewBlogChosen");

    await blogModel.findByIdAndUpdate(blog_id, {
      $push: { blog_views: _id },
    });

    res.json({ state: "success" });
  } catch (err) {
    console.log(`ERROR, client/viewBlogChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
