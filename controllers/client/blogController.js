const Blog = require("../../models/Blog");
const blogModel = require("../../schema/blog.model");

let blogController = module.exports;

blogController.getAllBlogs = async (req, res) => {
  try {
    console.log("POST: client/getAllBlogs");
    const blog = new Blog();
    const result = await blog.getAllBlogsData(req.member, req.body);
    res.json({ state: "success", data: result });
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
    const result = await blog.getChosenBlogsData(req.member, id);
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
    res.json({ state: 'success', data: result });
  } catch (err) {
    console.log(`ERROR, cont/getBlogWithOwner, ${err.message}`);
    res.json({ state: 'fail', message: err.message });
  }
};

blogController.likeBlogChosen = async (req, res) => {
  try {
    const {blog_id, _id} = req.body; 
    console.log("POST: client/likeBlogChosen");

    const found_blog = await blogModel.findById(blog_id);
    if (found_blog.blog_likes.includes(_id)) {
      found_blog.blog_likes =  found_blog.blog_likes.filter((id) => id !== _id);
    } else {
      found_blog.blog_likes = [...found_blog.blog_likes, _id];
    }

    await blogModel.findByIdAndUpdate(found_blog._id, {
      ...found_blog._doc,
    });

    res.json({ state: "success", });
  } catch (err) {
    console.log(`ERROR, client/likeBlogChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.viewBlogChosen = async (req, res) => {
  try {
    const {blog_id, _id} = req.body; 
    console.log("POST: client/viewBlogChosen");

    const found_blog = await blogModel.findById(blog_id);
    if (!found_blog.blog_views.includes(_id)) {
      found_blog.blog_views = [...found_blog.blog_views, _id];
    }

    await blogModel.findByIdAndUpdate(found_blog._id, {
      ...found_blog._doc,
    });

    res.json({ state: "success", });
  } catch (err) {
    console.log(`ERROR, client/viewBlogChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};