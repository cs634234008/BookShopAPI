const db = require("../config/db");

//Get All Books
const getBooks = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    db.query(
      `
    SELECT 
      bookid,title,isbn,pageCount,
      publishedDate,thumbnailUrl,
      shortDescription,authors.name as 'author',
      category,price
    FROM books,authors 
    WHERE books.author=authors.authorid`,
      function (error, results, fields) {
        if (error) throw error;
        return res
          .status(200)
          .send({ error: false, message: "books list", data: results });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Get Book by Id
const getBookById = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    var bookid = Number(req.params.bookid);

    db.query(
      `
    SELECT 
      bookid,title,isbn,pageCount,
      publishedDate,thumbnailUrl,
      shortDescription,authors.name as 'author',
      category,price
    FROM books,authors 
    WHERE books.author=authors.authorid AND books.bookid=?`,
      bookid.toString(),
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Update Book by Id
const updateBookById = async function (res, req) {
  try {
    var title = req.body.title;
    var price = req.body.price;
    var isbn = req.body.isbn;
    var pageCount = req.body.pageCount;
    var publishedDate = req.body.publishedDate;
    var thumbnailUrl = req.body.thumbnailUrl;
    var shortDescription = req.body.shortDescription;
    var author = req.body.author;
    var category = req.body.category;

    res.setHeader("Content-Type", "application/json");

    var bookid = Number(req.params.bookid);

    db.query(
      `UPDATE books 
              SET 
                    title='${title}', 
                    price=${price},
                    isbn= '${isbn}', 
                    pageCount=${pageCount}, 
                    publishedDate='${publishedDate}', 
                    thumbnailUrl='${thumbnailUrl}', 
                    shortDescription='${shortDescription}', 
                    author='${author}', 
                    category= '${category}'
              WHERE bookid=?`,
      bookid,
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "Edit book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Add new Book
const addBook = async function(req,res){
  try
  {

    var title = req.body.title; 	
    var price=req.body.price;
    var isbn = req.body.isbn;
    var pageCount = req.body.pageCount;
    var publishedDate=req.body.publishedDate;
    var thumbnailUrl=req.body.thumbnailUrl;
    var shortDescription=req.body.shortDescription;
    var author=req.body.author;
    var category=req.body.category;


    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    db.query(`INSERT INTO books 
      (title,price, isbn, pageCount, publishedDate, thumbnailUrl, 
      shortDescription, author, category) 
      VALUES ( '${title}',${price}, '${isbn}', ${pageCount}, '${publishedDate}', '${thumbnailUrl}', 
      '${shortDescription}', '${author}', '${category}');`,function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, message: 'Insert new book' });
    });

    
  } catch {

    return res.status(401).send()

  }
}

//Delete Book by Id
const deleteBookById = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    var bookid = Number(req.params.bookid);

    db.query(
      "DELETE FROM books where bookid=?",
      bookid,
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "Delete book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Upload book picture
const uploadBookCover = async function (req, res) {
  const bookCoverPath = process.env.BOOKSHOP_PICTURE_PATH;
  var bookid = Number(req.params.bookid);
  try {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" });
    }

    const bookPictureFile = req.files.book_cover;

    var path = require("path");
    var pictureEx = path.extname(bookPictureFile.name);
  
    bookPictureFile.mv(`${bookCoverPath}${bookid}${pictureEx}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }

      return res.send({
        name: `${bookid}${pictureEx}`,
        path: `${bookCoverPath}${bookid}${pictureEx}`,
      });
    });
  } catch {
    return res.status(401).send();
  }
};

module.exports = {
  getBooks,
  getBookById,
  updateBookById,
  addBook,
  deleteBookById,
  uploadBookCover,
};
