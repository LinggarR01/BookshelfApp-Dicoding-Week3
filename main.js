// Do your work here...
const books = JSON.parse(localStorage.getItem("books")) || [];

// Menampilkan daftar buku dari localStorage saat halaman dimuat.
window.onload = () => {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    
    // Menampilkan daftar buku yang tersimpan di localStorage dengan perulangan
    books.forEach(displayBook);
}

// Menambahkan buku
function addBook(event) {
    event.preventDefault();

    console.log("Adding book");

    const title = document
        .getElementById('bookFormTitle')
        .value;
    const author = document
        .getElementById('bookFormAuthor')
        .value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document
        .getElementById('bookFormIsComplete')
        .checked;

    let bookId = new Date().getTime();

    const newBook = {
        id: bookId,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    const books = JSON.parse(localStorage.getItem("books")) || [];

    books.push(newBook);
    // Simpan data terbaru ke localStorage
    localStorage.setItem("books", JSON.stringify(books));

    displayBook(newBook);

    document.getElementById("bookForm").reset();
}

// Menampilkan daftar buku
function displayBook(book) {
    // Tentukan tempat menampilkan buku berdasarkan status isComplete
    const bookList = book.isComplete
        ? document.getElementById("completeBookList")
        : document.getElementById("incompleteBookList");

    // Buat elemen buku
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.setAttribute("data-bookid", book.id);

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.textContent = book.title;
    bookItem.appendChild(title);

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.textContent = `Penulis: ${book.author}`;
    bookItem.appendChild(author);

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.textContent = `Tahun: ${book.year}`;
    bookItem.appendChild(year);

    const buttonContainer = document.createElement("div");

    // Tombol untuk mengubah status buku
    const isCompleteButton = document.createElement("button");
    isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    isCompleteButton.style.background = "#4CAF50";
    isCompleteButton.textContent = book.isComplete
        ? "Belum Selesai Dibaca"
        : "Selesai Dibaca";
    isCompleteButton.addEventListener("click", () => toggleBookStatus(book.id));
    buttonContainer.appendChild(isCompleteButton);

    // Tombol untuk menghapus buku
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.style.background = "#E50046";
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => deleteBook(book.id));
    buttonContainer.appendChild(deleteButton);

    // Tombol untuk mengedit buku
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.style.background = "#FFA500";
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => openEditModal(book));
    buttonContainer.appendChild(editButton);

    bookItem.appendChild(buttonContainer);
    bookList.appendChild(bookItem);

    addEditButtonListener(book);
}

// Menghapus buku
function deleteBook(bookid) { 
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const filteredBooks = books.filter(book => book.id!== bookid);
    localStorage.setItem("books", JSON.stringify(filteredBooks));

    // Hapus elemen buku yang terkait di DOM
    const bookElement = document.querySelector(`[data-bookid="${bookid}"]`);
    bookElement.parentNode.removeChild(bookElement);
}

// Mengubah status buku
function toggleBookStatus(bookid) {
    // Ambil data buku dari localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // Update status buku
    const updatedBooks = books.map((book) => {
        if (book.id === bookid) {
            return {
                ...book,
                isComplete: !book.isComplete
            };
        }
        return book;
    });

    // Simpan data terbaru ke localStorage
    localStorage.setItem("books", JSON.stringify(updatedBooks));

    // Temukan elemen buku di DOM
    const bookElement = document.querySelector(`[data-bookid="${bookid}"]`);

    // Temukan tombol status buku
    const isCompleteButton = bookElement.querySelector(
        '[data-testid="bookItemIsCompleteButton"]'
    );

    // Update teks tombol status
    const isComplete = updatedBooks
        .find((book) => book.id === bookid)
        .isComplete;
    isCompleteButton.textContent = isComplete
        ? "Belum Selesai Dibaca"
        : "Selesai Dibaca";

    // Pindahkan buku ke section yang sesuai
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    if (isComplete) {
        // Pindahkan ke section "Selesai dibaca"
        incompleteBookList.removeChild(bookElement); 
        completeBookList.appendChild(bookElement); 
    } else {
        // Pindahkan ke section "Belum selesai dibaca"
        completeBookList.removeChild(bookElement); 
        incompleteBookList.appendChild(bookElement); 
    }
}

// Melakukan pencarian buku berdasarkan Judul
function searchBooks(event) {
    event.preventDefault(); // Mencegah form dari reload halaman

    // Ambil kata kunci dari input pencarian
    const keyword = document
        .getElementById("searchBookTitle")
        .value
        .toLowerCase();

    // Ambil data buku dari localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // Filter buku berdasarkan judul
    const searchResults = books.filter(
        (book) => book.title.toLowerCase().includes(keyword)
    );

    // Kosongkan daftar buku yang sedang ditampilkan
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    // Tampilkan hasil pencarian
    searchResults.forEach((book) => displayBook(book));
}

// Menampilkan Modal
function openEditModal(book) {
    document.getElementById("editBookId").value = book.id;
    document.getElementById("editBookFormTitle").value = book.title;
    document.getElementById("editBookFormAuthor").value = book.author;
    document.getElementById("editBookFormYear").value = book.year;
    document.getElementById("editBookModal").style.display = "flex";
}

// Menutup Modal
function closeEditModal() {
    document.getElementById("editBookModal").style.display = "none";
}


// Simpan perubahan data buku
function saveEditedBook() {
    // Ambil nilai dari form edit
    const bookId = parseInt(document.getElementById("editBookId").value);
    const title = document.getElementById("editBookFormTitle").value.trim();
    const author = document.getElementById("editBookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("editBookFormYear").value);
  
    // Validasi input
    if (!title || !author || isNaN(year)) {
      alert("Harap isi semua field dengan benar!");
      return;
    }
  
    // Ambil data buku dari localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
  
    // Update data buku
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, title, author, year } : book
    );
  
    // Simpan data terbaru ke localStorage
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  
    // Perbarui tampilan daftar buku
    reloadBooks();
  
    // Tutup modal edit
    closeEditModal();
}

// Update data buku
function reloadBooks() {
    // Kosongkan daftar buku yang sedang ditampilkan
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
  
    // Ambil data buku dari localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
  
    // Tampilkan semua buku
    books.forEach((book) => displayBook(book));
}

function addEditButtonListener(book) {
    const editButton = document.querySelector(
      `[data-bookid="${book.id}"] [data-testid="bookItemEditButton"]`
    );
    editButton.addEventListener("click", () => openEditModal(book));
}

// Menyimpan hasil edit
document.getElementById("saveEditBook").addEventListener("click", (event) => {
    event.preventDefault(); 
    saveEditedBook(); 
});

// Tutup modal edit
document.getElementById("closeEditModal").addEventListener("click", (event) => {
    event.preventDefault(); 
    closeEditModal(); 
});

// Menambahkan buku
document.getElementById("bookForm").addEventListener("submit", addBook);

// Menampilkan buku yang disearch
document.getElementById("searchBook").addEventListener("click", searchBooks);