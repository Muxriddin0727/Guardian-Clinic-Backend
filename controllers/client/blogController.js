const Blog = require("../../models/Blog");

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
