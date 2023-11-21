const Blog = require("../../models/Blog");
const assert = require("assert");
const Definer = require("../../lib/mistake");

let blogController = module.exports;

//Secured//

blogController.addNewBlog = async (req, res) => {
  try {
    console.log("POST: cont/addNewBlog", req.body);

    const blog = new Blog();
    let data = req.body;

    console.log(req.session);

    const result = await blog.addNewBlogData(data, req.member);

    const html = `<script>
          alert('new product has benn added successfully');
          window.location.replace("/secured/doctor/dashboard");
        </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR: cont/addNewBlog, ${err.message}`);
  }
};

blogController.updateChosenBlog = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenBlog");
    const blog = new Blog();
    const id = req.params.id;
    // console.log("req.params.id", req.params.id);
    const result = await blog.updateChosenBlogData(
      id,
      req.body,
      req.member._id
    );
    // ejs da rest api ham ishlatiladi res.render ham
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR: cont/updateChosenBlog, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
