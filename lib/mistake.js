class Definer {
    /* general errors  */
    static general_err1 = "att: something went wrong!";
    static general_err2 = "att: there is no data with that params!";
    static general_err3 = "att: file upload error!";
  
    /* member auth related errors */
    static auth_err2 = "att: jwt token creation error!";
    static auth_err3 = "att: no member with that mb_nick!";
    static auth_err4 = "att: your credentials do not match!";
    static auth_err5 = "att: you are not authenticated!";
  
    /* product related errors  */
    static product_err1 = "att: product creation is failed!";
  
    /* order related errors  */
    static order_err1 = "att: order creation is failed!";
    static order_err2 = "att: order item creation is failed!";
    static order_err3 = "att: no order with that params exists!";
  
    /* article related errors  */
    static article_err1 = "att: author member for articles not provided!";
    static article_err2 = "att: no article found for that member!";
    static article_err3 = "att: no articles found for that target!";
  
    /* follow related errors  */
    static follow_err1 = "att: self subscription is denied!";
    static follow_err2 = "att: new follow subscription is failed!";
    static follow_err3 = "att: no follow data found!";
  
    /* db related errors  */
    static mongo_validation_err1 = "att: mongodb validation failed!";
  }
  
  module.exports = Definer;