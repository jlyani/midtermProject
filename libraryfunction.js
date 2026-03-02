// libraryfunction.js
// functions assigned to our group
// uses Book and Transaction classes from the other js files


// shows total books, available books, and active borrows on the dashboard
function loadDashboardStats() {
    var books = Book.getAll();
    var transactions = Transaction.getAll();

    // count total books
    var totalBooks = books.length;

    // count books that still have available copies
    var availableBooks = 0;
    for (var i = 0; i < books.length; i++) {
        if (books[i].availableCopies > 0) {
            availableBooks++;
        }
    }

    // count active borrows and overdue
    var activeBorrows = 0;
    var overdueCount = 0;
    for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].status === "borrowed" || transactions[i].status === "overdue") {
            activeBorrows++;
        }
        if (transactions[i].status === "overdue") {
            overdueCount++;
        }
    }

    // update the stat cards on the dashboard
    document.getElementById("stat-total").textContent = totalBooks;
    document.getElementById("stat-available").textContent = availableBooks;
    document.getElementById("stat-active").textContent = activeBorrows;
    document.getElementById("stat-overdue").textContent = overdueCount;
}


// renders the books table in the manage books page
function loadBookTable() {
    var books = Book.getAll();

    // check if there is a search query
    var searchInput = document.getElementById("book-search");
    var query = searchInput ? searchInput.value.toLowerCase() : "";

    // filter books based on search
    if (query) {
        var filtered = [];
        for (var i = 0; i < books.length; i++) {
            var b = books[i];
            if (b.title.toLowerCase().indexOf(query) !== -1 ||
                b.author.toLowerCase().indexOf(query) !== -1 ||
                b.id.toLowerCase().indexOf(query) !== -1) {
                filtered.push(b);
            }
        }
        books = filtered;
    }

    var tbody = document.getElementById("books-tbody");

    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:30px;">No books found.</td></tr>';
        return;
    }

    // build the rows
    var rows = "";
    for (var i = 0; i < books.length; i++) {
        var b = books[i];
        rows += "<tr>" +
            "<td>" + b.id + "</td>" +
            "<td>" + b.title + "</td>" +
            "<td>" + b.author + "</td>" +
            "<td>" + b.category + "</td>" +
            "<td>" + b.isbn + "</td>" +
            "<td>" + b.totalCopies + "</td>" +
            "<td>" + b.availableCopies + "</td>" +
            "<td>" +
                "<button class='action-btn btn-edit' onclick='openEditBookModal(\"" + b.id + "\")'>✏️</button>" +
                "<button class='action-btn btn-delete' onclick='openDeleteModal(\"" + b.id + "\")'>🗑️</button>" +
            "</td>" +
        "</tr>";
    }

    tbody.innerHTML = rows;
}


// opens the add book modal and clears the form
function openAddBookModal() {
    document.getElementById("modal-title").value = "";
    document.getElementById("modal-author").value = "";
    document.getElementById("modal-category").value = "";
    document.getElementById("modal-isbn").value = "";
    document.getElementById("modal-copies").value = "1";
    document.getElementById("modal-book-id").value = "";
    document.getElementById("book-modal-title").textContent = "Add New Book";
    document.getElementById("book-modal").classList.add("open");
}


// saves the new book using data from the modal form
function handleAddBook() {
    var title    = document.getElementById("modal-title").value.trim();
    var author   = document.getElementById("modal-author").value.trim();
    var category = document.getElementById("modal-category").value.trim();
    var isbn     = document.getElementById("modal-isbn").value.trim();
    var copies   = parseInt(document.getElementById("modal-copies").value);

    if (!title || !author || !isbn) {
        showNotification("Please fill in all required fields.", "error");
        return;
    }

    try {
        Book.addBook(title, author, category, isbn, copies, "AD0001");
        document.getElementById("book-modal").classList.remove("open");
        showNotification("Book added successfully!", "success");
        loadBookTable();
        loadDashboardStats();
    } catch (e) {
        showNotification(e.message, "error");
    }
}


// opens the edit modal and fills in the existing book data
function openEditBookModal(bookId) {
    var books = Book.getAll();
    var found = null;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            found = books[i];
            break;
        }
    }

    if (!found) {
        showNotification("Book not found.", "error");
        return;
    }

    document.getElementById("modal-title").value    = found.title;
    document.getElementById("modal-author").value   = found.author;
    document.getElementById("modal-category").value = found.category;
    document.getElementById("modal-isbn").value     = found.isbn;
    document.getElementById("modal-copies").value   = found.totalCopies;
    document.getElementById("modal-book-id").value  = found.id;
    document.getElementById("book-modal-title").textContent = "Edit Book";
    document.getElementById("book-modal").classList.add("open");
}


// saves the updated book details back to storage
function handleUpdateBook() {
    var bookId   = document.getElementById("modal-book-id").value;
    var title    = document.getElementById("modal-title").value.trim();
    var author   = document.getElementById("modal-author").value.trim();
    var category = document.getElementById("modal-category").value.trim();
    var isbn     = document.getElementById("modal-isbn").value.trim();
    var copies   = parseInt(document.getElementById("modal-copies").value);

    if (!title || !author || !isbn) {
        showNotification("Please fill in all required fields.", "error");
        return;
    }

    var books = Book.getAll();
    var updated = false;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            books[i].setTitle(title);
            books[i].setAuthor(author);
            books[i].setCategory(category);
            books[i].setIsbn(isbn);
            books[i].setTotalCopies(copies);
            updated = true;
            break;
        }
    }

    if (!updated) {
        showNotification("Book not found.", "error");
        return;
    }

    Book.saveAll(books);
    document.getElementById("book-modal").classList.remove("open");
    showNotification("Book updated successfully!", "success");
    loadBookTable();
    loadDashboardStats();
}


// deletes a book using the Book class
function deleteBook(bookId) {
    try {
        Book.deleteBook(bookId);
        showNotification("Book deleted.", "success");
        loadBookTable();
        loadDashboardStats();
    } catch (e) {
        showNotification(e.message, "error");
    }
}


// renders the borrow form — fills the student and book dropdowns
function loadBorrowForm() {
    var students = JSON.parse(localStorage.getItem("elib_students")) || [];
    var books = Book.getAll();

    // populate the student dropdown
    var studentSelect = document.getElementById("borrow-studentId");
    if (studentSelect) {
        var studentOptions = '<option value="">-- Select Student --</option>';
        for (var i = 0; i < students.length; i++) {
            var s = students[i];
            studentOptions += '<option value="' + s.id + '">' + s.id + " – " + s.name + "</option>";
        }
        studentSelect.innerHTML = studentOptions;
    }

    // populate the book dropdown — only available books
    var bookSelect = document.getElementById("borrow-bookId");
    if (bookSelect) {
        var bookOptions = '<option value="">-- Select Book --</option>';
        for (var i = 0; i < books.length; i++) {
            var b = books[i];
            if (b.availableCopies > 0) {
                bookOptions += '<option value="' + b.id + '">' + b.id + " – " + b.title + " (" + b.availableCopies + " available)</option>";
            }
        }
        bookSelect.innerHTML = bookOptions;
    }
}


// handles the borrow form submission — calls Transaction.borrowBook()
function handleBorrowBook() {
    var studentId   = document.getElementById("borrow-studentId").value;
    var bookId      = document.getElementById("borrow-bookId").value;
    var librarianId = document.getElementById("borrow-librarianId").value.trim();

    if (!studentId || !bookId || !librarianId) {
        showNotification("Please fill in all fields.", "error");
        return;
    }

    try {
        Transaction.borrowBook(bookId, studentId, librarianId);
        showNotification("Book borrowed successfully!", "success");

        // reset the dropdowns and refresh
        document.getElementById("borrow-studentId").value = "";
        document.getElementById("borrow-bookId").value = "";
        loadBorrowForm();
        loadDashboardStats();
    } catch (e) {
        showNotification(e.message, "error");
    }
}


// shows the active transactions table on the return page
function loadReturnForm() {
    var transactions = Transaction.getAll();
    var tbody = document.getElementById("active-tx-tbody");

    // only get borrowed or overdue transactions
    var activeTxs = [];
    for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].status === "borrowed" || transactions[i].status === "overdue") {
            activeTxs.push(transactions[i]);
        }
    }

    if (activeTxs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px;">No active borrows.</td></tr>';
        return;
    }

    var rows = "";
    for (var i = 0; i < activeTxs.length; i++) {
        var t = activeTxs[i];
        rows += "<tr>" +
            "<td>" + t.id + "</td>" +
            "<td>" + t.bookId + "</td>" +
            "<td>" + t.studentId + "</td>" +
            "<td>" + formatDate(t.borrowDate) + "</td>" +
            "<td>" + formatDate(t.dueDate) + "</td>" +
            "<td><span class='badge badge-" + t.status + "'>" + t.status + "</span></td>" +
        "</tr>";
    }

    tbody.innerHTML = rows;
}


// processes the book return — calls Transaction.returnBook()
function handleReturnBook(transactionId) {
    var librarianId = document.getElementById("return-librarianId").value.trim();

    // if no transactionId was passed, get it from the input field
    if (!transactionId) {
        transactionId = document.getElementById("return-txId").value.trim();
    }

    if (!transactionId) {
        showNotification("Please enter a Transaction ID.", "error");
        return;
    }

    try {
        Transaction.returnBook(transactionId, librarianId);
        showNotification("Book returned successfully!", "success");

        document.getElementById("return-txId").value = "";
        loadReturnForm();
        loadDashboardStats();
    } catch (e) {
        showNotification(e.message, "error");
    }
}


// shows all transactions in the transactions table
function loadTransactionTable() {
    var transactions = Transaction.getAll();

    // check search query
    var searchEl = document.getElementById("tx-search");
    var query = searchEl ? searchEl.value.toLowerCase() : "";

    // check status filter
    var filterEl = document.getElementById("tx-filter");
    var filter = filterEl ? filterEl.value : "all";

    // filter by search
    if (query) {
        var filtered = [];
        for (var i = 0; i < transactions.length; i++) {
            var t = transactions[i];
            if (t.id.toLowerCase().indexOf(query) !== -1 ||
                t.bookId.toLowerCase().indexOf(query) !== -1 ||
                t.studentId.toLowerCase().indexOf(query) !== -1) {
                filtered.push(t);
            }
        }
        transactions = filtered;
    }

    // filter by status
    if (filter !== "all") {
        var filtered2 = [];
        for (var i = 0; i < transactions.length; i++) {
            if (transactions[i].status === filter) {
                filtered2.push(transactions[i]);
            }
        }
        transactions = filtered2;
    }

    var tbody = document.getElementById("tx-tbody");

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:30px;">No transactions found.</td></tr>';
        return;
    }

    var rows = "";
    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i];
        rows += "<tr>" +
            "<td>" + t.id + "</td>" +
            "<td>" + t.bookId + "</td>" +
            "<td>" + t.studentId + "</td>" +
            "<td>" + t.librarianId + "</td>" +
            "<td>" + formatDate(t.borrowDate) + "</td>" +
            "<td>" + formatDate(t.dueDate) + "</td>" +
            "<td>" + (t.returnDate ? formatDate(t.returnDate) : "—") + "</td>" +
            "<td><span class='badge badge-" + t.status + "'>" + t.status + "</span></td>" +
        "</tr>";
    }

    tbody.innerHTML = rows;
}


// shows a toast notification on screen
// type: "success", "error", or "warning"
function showNotification(message, type) {
    var el = document.getElementById("toast");
    var iconWrap = document.getElementById("toast-icon-wrap");
    var msgEl = document.getElementById("toast-msg");

    msgEl.textContent = message;
    iconWrap.className = "toast-icon-wrap";

    if (type === "error") {
        iconWrap.classList.add("error");
        iconWrap.textContent = "✕";
    } else if (type === "warning") {
        iconWrap.classList.add("warning");
        iconWrap.textContent = "!";
    } else {
        iconWrap.classList.add("success");
        iconWrap.textContent = "✓";
    }

    el.className = "toast show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
}
