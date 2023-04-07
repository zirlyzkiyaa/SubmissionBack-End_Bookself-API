const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 3 : API dapat menyimpan buku
// Handler untuk method 'POST' - Menambahkan data untuk "books"
const addBookHandler = (request, h) => {
  // Client mengirim data "books" yang akan disimpan dalam bentuk JSON melalui body request
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Properti yang diolah dan didapatkan di Server
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Memasukkan nilai-nilai tersebut ke dalam Array books
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Apabila nama buku tidak terdata, Server - Respons "fail"
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Apabila "readPage > pageCount", Server - Respons "fail"
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // Data baru "books" dikirim ke server
  books.push(newBook);

  // Mendapatkan objek "book" dari objek array "books" dengan method array filter() berdasarkan id
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Server - Respons
  // Apabila buku berhasil ditambahkan, Server - Respons "success"
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // Apabila buku gagal ditambahkan, Server - Respons "fail"
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak berhasil ditamabahkan',
  });

  response.code(500);
  return response;
};

// Kriteria 4 : API dapat menampilkan seluruh buku
// Handler untuk method 'GET' - Menampilkan seluruh data "books"
const getAllBooksHandler = (request, h) => {
  // Client request data "books" yang ingin dilihat melalui body request
  const {
    name, reading, finished,
  } = request.query;

  // Apabila nama buku terdata, Server - Respons "success"
  if (name !== undefined) {
    const allBooks = books.filter((book) => book.name === name);

    const response = h.response({
      status: 'success',
      data: {
        books: allBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  // Apabila buku tersebut terdata "reading" atau "unreading", Server - Respons "success"
  if (reading === '0') {
    const falseReadBook = books.filter((book) => book.reading === false);

    const response = h.response({
      status: 'success',
      data: {
        books: falseReadBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading === '1') {
    const trueReadBook = books.filter((book) => book.reading === true);

    const response = h.response({
      status: 'success',
      data: {
        books: trueReadBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  // Apabila buku tersebut terdata "finished" atau "unfinished", Server - Respons "success"
  if (finished === '0') {
    const falsefinishdBook = books.filter((book) => book.finished === false);

    const response = h.response({
      status: 'success',
      data: {
        books: falsefinishdBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished === '1') {
    const falsefinishdBook = books.filter((book) => book.finished === true);

    const response = h.response({
      status: 'success',
      data: {
        books: falsefinishdBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  // Menampilkan keseluruhan data "books" yang tersimpan
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

// Kriteria 5 : API dapat menampilkan detail buku
// Handler untuk method 'GET' - Menampilkan seluruh data "books" Berdasarkan bookId
const getBookByIdHandler = (request, h) => {
  // Mendapatkan nilai "bookId" melalui "request.params"
  const { bookId } = request.params;

  // Mendapatkan objek "book" dari objek array "books" dengan method array filter()
  const book = books.filter((b) => b.id === bookId)[0];

  // Server - Respons "success"
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // Server - Respons "fail"
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Kriteria 6 : API dapat mengubah data buku
// Handler untuk method 'PUT' - Memperbaharui data "books"
const updateBookByIdHandler = (request, h) => {
  // Mendapatkan nilai "bookId" melalui "request.params"
  const { bookId } = request.params;

  // Client mengirim data "Books" yang akan diubah dalam bentuk JSON melalui body request
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Memperbaharui nilai dari properti "UpdatedAt"
  const updatedAt = new Date().toISOString();

  // Apabila nama "undefined", Server - Respons "fail"
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Apabila "readPage > pageCount", Server - Respons "fail"
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // Mendapatkan index array pada objek "books" sesuai bookId melalui method array findIndex()
  const index = books.findIndex((book) => book.id === bookId);

  // Apabila buku terdapat di index "!== -1", Server - Respons "success"
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  // Apabila bookId tidak ditemukan, Server - Respons "fail"
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Kriteria 7 : API dapat menghapus buku
// Handler untuk method 'DELETE' - Menghapus data "Books"
const deleteBookByIdHandler = (request, h) => {
  // Mendapatkan nilai "bookId" melalui "request.params"
  const { bookId } = request.params;

  // Mencari data "Book" melalui fungsi findIndex
  const index = books.findIndex((book) => book.id === bookId);

  // Apabila buku terdapat di index "!== -1", Server - Respons "success"
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  // Apabila bookId tidak ditemukan, Server - Respons "fail"
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Ekspor fungsi handler
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
