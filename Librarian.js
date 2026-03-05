function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    var d = localStorage.getItem(key);
    if (d == null) return [];
    return JSON.parse(d);
}

var currentUser = {
    id: "LB0001",
    name: "Maria Santos",
    role: "librarian"
};

function seedData() {
    if (!localStorage.getItem("elib_librarians")) {
        var librarians = [
            { id: "LB0001", name: "Maria Santos", email: "maria@elibrary.com", password: "lib123", role: "librarian" },
            { id: "LB0002", name: "Jose Reyes", email: "jose@elibrary.com", password: "lib123", role: "librarian" }
        ];
        saveData("elib_librarians", librarians);
    }

    var savedLibrarians = loadData("elib_librarians");
    if (savedLibrarians.length > 0) {
        currentUser = savedLibrarians[0];
    }

    if (localStorage.getItem("elib_books") && localStorage.getItem("elib_transactions")) {
        return;
    }

    var books = [
        { id: "BK0001", title: "Clean Code", author: "Robert C. Martin", category: "Programming", isbn: "978-0-13-235088-4", totalCopies: 5, availableCopies: 5, addedBy: "AD0001" },
        { id: "BK0002", title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", isbn: "978-0-13-595705-9", totalCopies: 4, availableCopies: 4, addedBy: "AD0001" },
        { id: "BK0003", title: "You Don't Know JS", author: "Kyle Simpson", category: "Programming", isbn: "978-1-491-92446-4", totalCopies: 5, availableCopies: 5, addedBy: "AD0001" },
        { id: "BK0004", title: "Python Crash Course", author: "Eric Matthes", category: "Programming", isbn: "978-1-593-27603-4", totalCopies: 4, availableCopies: 4, addedBy: "AD0001" },
        { id: "BK0005", title: "Design Patterns", author: "Erich Gamma", category: "Programming", isbn: "978-0-20-163361-5", totalCopies: 3, availableCopies: 3, addedBy: "AD0001" },
        { id: "BK0006", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "History", isbn: "978-0-06-231609-7", totalCopies: 5, availableCopies: 5, addedBy: "AD0001" },
        { id: "BK0007", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", isbn: "978-0-374-53355-7", totalCopies: 3, availableCopies: 3, addedBy: "AD0001" },
        { id: "BK0008", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", isbn: "978-0-553-38016-3", totalCopies: 4, availableCopies: 4, addedBy: "AD0001" },
        { id: "BK0009", title: "The Art of War", author: "Sun Tzu", category: "Philosophy", isbn: "978-1-59030-225-5", totalCopies: 4, availableCopies: 4, addedBy: "AD0001" },
        { id: "BK0010", title: "The Intelligent Investor", author: "Benjamin Graham", category: "Finance", isbn: "978-0-06-055566-5", totalCopies: 3, availableCopies: 3, addedBy: "AD0001" }
    ];

    var transactions = [
        { id: "TX0001", bookId: "BK0001", studentId: "SD0001", librarianId: "LB0001", borrowDate: "2025-01-15", dueDate: "2025-01-29", returnDate: "2025-01-28", status: "returned" },
        { id: "TX0002", bookId: "BK0003", studentId: "SD0002", librarianId: "LB0001", borrowDate: "2025-03-10", dueDate: "2025-03-24", returnDate: null, status: "overdue" },
        { id: "TX0003", bookId: "BK0005", studentId: "SD0003", librarianId: "LB0002", borrowDate: "2025-06-05", dueDate: "2025-06-19", returnDate: null, status: "borrowed" },
        { id: "TX0004", bookId: "BK0007", studentId: "SD0001", librarianId: "LB0002", borrowDate: "2025-09-20", dueDate: "2025-10-04", returnDate: null, status: "borrowed" },
        { id: "TX0005", bookId: "BK0009", studentId: "SD0002", librarianId: "LB0001", borrowDate: "2026-01-10", dueDate: "2026-01-24", returnDate: null, status: "borrowed" }
    ];

    saveData("elib_books", books);
    saveData("elib_transactions", transactions);
}

function getAllBooks() {
    return loadData("elib_books");
}

function saveAllBooks(books) {
    saveData("elib_books", books);
}

function generateBookId(books) {
    var prefix = "BK";
    var n = books.length + 1;
    if (n < 10)   return prefix + "000" + n;
    if (n < 100)  return prefix + "00" + n;
    if (n < 1000) return prefix + "0" + n;
    return prefix + n;
}

function addBook(title, author, category, isbn, totalCopies, addedBy) {
    if (!title || !author || !isbn) {
        throw new Error("Required fields are missing.");
    }

    var books = getAllBooks();
    var newId = generateBookId(books);

    var newBook = {
        id: newId,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isbn: isbn.trim(),
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(totalCopies),
        addedBy: addedBy
    };

    books.push(newBook);
    saveAllBooks(books);
    return newBook;
}

function deleteBook(bookId) {
    var books = getAllBooks();
    var idx = -1;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            idx = i;
            break;
        }
    }

    if (idx === -1) throw new Error("Book not found.");

    if (books[idx].availableCopies < books[idx].totalCopies) {
        throw new Error("Cannot delete: this book has active borrows.");
    }

    books.splice(idx, 1);
    saveAllBooks(books);
}

function updateBook(bookId, title, author, category, isbn, totalCopies) {
    var books = getAllBooks();
    var book = null;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            book = books[i];
            break;
        }
    }

    if (!book) throw new Error("Book not found.");

    var diff = parseInt(totalCopies) - book.totalCopies;
    book.title = title.trim();
    book.author = author.trim();
    book.category = category.trim();
    book.isbn = isbn.trim();
    book.totalCopies = parseInt(totalCopies);
    book.availableCopies = Math.max(0, book.availableCopies + diff);

    saveAllBooks(books);
}

function decrementAvailable(bookId) {
    var books = getAllBooks();

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            if (books[i].availableCopies <= 0) {
                throw new Error("No copies available.");
            }
            books[i].availableCopies--;
            saveAllBooks(books);
            return;
        }
    }

    throw new Error("Book not found.");
}

function incrementAvailable(bookId) {
    var books = getAllBooks();

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            if (books[i].availableCopies < books[i].totalCopies) {
                books[i].availableCopies++;
                saveAllBooks(books);
            }
            return;
        }
    }
}

function getAllTransactions() {
    return loadData("elib_transactions");
}

function saveAllTransactions(txs) {
    saveData("elib_transactions", txs);
}

function generateTxId(txs) {
    var prefix = "TX";
    var n = txs.length + 1;
    if (n < 10)   return prefix + "000" + n;
    if (n < 100)  return prefix + "00" + n;
    if (n < 1000) return prefix + "0" + n;
    return prefix + n;
}

function borrowBook(bookId, studentId, librarianId) {
    var txs = getAllTransactions();

    for (var i = 0; i < txs.length; i++) {
        if (txs[i].studentId === studentId && txs[i].bookId === bookId && txs[i].status === "borrowed") {
            throw new Error("Student already has an active borrow for this book.");
        }
    }

    decrementAvailable(bookId);

    var now = new Date();
    var due = new Date();
    due.setDate(now.getDate() + 7); // 7 days to return

    var newId = generateTxId(txs);

    var newTx = {
        id: newId,
        bookId: bookId,
        studentId: studentId,
        librarianId: librarianId,
        borrowDate: now.toISOString(),
        dueDate: due.toISOString(),
        returnDate: null,
        status: "borrowed"
    };

    txs.push(newTx);
    saveAllTransactions(txs);
    return newTx;
}

function returnBook(txId, librarianId) {
    var txs = getAllTransactions();

    for (var i = 0; i < txs.length; i++) {
        if (txs[i].id === txId) {
            if (txs[i].status === "returned") {
                throw new Error("Book already returned.");
            }
            txs[i].status = "returned";
            txs[i].returnDate = new Date().toISOString();
            incrementAvailable(txs[i].bookId);
            saveAllTransactions(txs);
            return txs[i];
        }
    }

    throw new Error("Transaction not found.");
}

function navigateTo(pageId) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
    }

    document.getElementById('page-' + pageId).classList.add('active');

    var targetNav = document.querySelector('[data-page="' + pageId + '"]');
    if (targetNav) targetNav.classList.add('active');

    if (pageId === 'dashboard')     loadDashboardStats();
    if (pageId === 'manage-books')  loadBookTable();
    if (pageId === 'borrow-book')   loadBorrowForm();
    if (pageId === 'return-book')   loadReturnForm();
    if (pageId === 'transactions')  loadTransactionTable();
}

var allNavItems = document.querySelectorAll('[data-page]');
for (var i = 0; i < allNavItems.length; i++) {
    allNavItems[i].addEventListener('click', function() {
        navigateTo(this.dataset.page);
    });
}

function loadDashboardStats() {
    document.getElementById('sidebarUserId').textContent = currentUser.id || 'LB0001';
    document.getElementById('welcome-title').textContent = 'Welcome back, ' + (currentUser.name || 'Maria Santos') + '!';

    var books = getAllBooks();
    var txs = getAllTransactions();

    var totalBooks = books.length;
    var availableBooks = 0;
    for (var i = 0; i < books.length; i++) {
        if (books[i].availableCopies > 0) availableBooks++;
    }

    var activeBorrows = 0;
    var overdue = 0;
    for (var i = 0; i < txs.length; i++) {
        if (txs[i].status === "borrowed" || txs[i].status === "overdue") activeBorrows++;
        if (txs[i].status === "overdue") overdue++;
    }

    document.getElementById('stat-total').textContent = totalBooks;
    document.getElementById('stat-available').textContent = availableBooks;
    document.getElementById('stat-active').textContent = activeBorrows;
    document.getElementById('stat-overdue').textContent = overdue;

    var tbody = document.getElementById('dashboard-book-tbody');
    var preview = books.slice(0, 5);

    if (preview.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">' + getEmptyStateHTML('dashboard') + '</td></tr>';
        return;
    }

    var rows = '';
    for (var i = 0; i < preview.length; i++) {
        var b = preview[i];
        rows += '<tr>' +
            '<td>' + b.id + '</td>' +
            '<td>' + b.title + '</td>' +
            '<td>' + b.author + '</td>' +
            '<td>' + b.category + '</td>' +
            '<td>' + b.availableCopies + '</td>' +
            '<td>' +
                '<button class="action-btn btn-edit" onclick="openEditBookModal(\'' + b.id + '\')">✏️</button>' +
                '<button class="action-btn btn-delete" onclick="openDeleteModal(\'' + b.id + '\')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = rows;
}

function loadBookTable() {
    var books = getAllBooks();
    var searchInput = document.getElementById('book-search');
    var query = searchInput ? searchInput.value.toLowerCase() : '';

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

    var tbody = document.getElementById('books-tbody');

    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">' + getEmptyStateHTML('manage') + '</td></tr>';
        return;
    }

    var rows = '';
    for (var i = 0; i < books.length; i++) {
        var b = books[i];
        rows += '<tr>' +
            '<td>' + b.id + '</td>' +
            '<td>' + b.title + '</td>' +
            '<td>' + b.author + '</td>' +
            '<td>' + b.category + '</td>' +
            '<td>' + b.isbn + '</td>' +
            '<td>' + b.totalCopies + '</td>' +
            '<td>' + b.availableCopies + '</td>' +
            '<td>' +
                '<button class="action-btn btn-edit" onclick="openEditBookModal(\'' + b.id + '\')">✏️</button>' +
                '<button class="action-btn btn-delete" onclick="openDeleteModal(\'' + b.id + '\')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = rows;
}

function getEmptyStateHTML(page) {
    var btnAction = page === 'dashboard'
        ? "navigateTo('manage-books');openAddBookModal();"
        : "openAddBookModal();";

    return '<div style="text-align:center;padding:48px 20px;">' +
        '<img src="trash.png" width="350">'  +
        '<p style="font-size:14px;font-weight:600;color:#555;margin-bottom:6px;line-height:1.5;">' +
            "It looks like there aren't any Book Records yet. Click the<br>button below to add new Book Record." +
        '</p>' +
        '<button onclick="' + btnAction + '" style="margin-top:14px;background:var(--green);color:#fff;border:none;border-radius:8px;padding:11px 28px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">' +
            '+ Add Book' +
        '</button>' +
    '</div>';
}

var editingBookId = null;
var originalBookData = null;

function openAddBookModal() {
    editingBookId = null;
    originalBookData = null;

    document.getElementById('book-modal-title').textContent = 'Add New Book';
    document.getElementById('modal-title').value = '';
    document.getElementById('modal-author').value = '';
    document.getElementById('modal-category').value = '';
    document.getElementById('modal-isbn').value = '';
    document.getElementById('modal-copies').value = '1';
    document.getElementById('modal-book-id').value = '';
    document.getElementById('book-modal').classList.add('open');
}

function openEditBookModal(bookId) {
    var books = getAllBooks();
    var book = null;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            book = books[i];
            break;
        }
    }

    if (!book) return;

    editingBookId = bookId;

    originalBookData = {
        title: book.title,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        copies: String(book.totalCopies)
    };

    document.getElementById('book-modal-title').textContent = 'Edit Book';
    document.getElementById('modal-title').value = book.title;
    document.getElementById('modal-author').value = book.author;
    document.getElementById('modal-category').value = book.category;
    document.getElementById('modal-isbn').value = book.isbn;
    document.getElementById('modal-copies').value = book.totalCopies;
    document.getElementById('modal-book-id').value = bookId;
    document.getElementById('book-modal').classList.add('open');
}

function hasChanges() {
    var t = document.getElementById('modal-title').value.trim();
    var a = document.getElementById('modal-author').value.trim();
    var c = document.getElementById('modal-category').value.trim();
    var isbn = document.getElementById('modal-isbn').value.trim();
    var n = document.getElementById('modal-copies').value;

    if (!editingBookId) {
        return (t !== '' || a !== '' || c !== '' || isbn !== '');
    }

    return (
        t !== originalBookData.title ||
        a !== originalBookData.author ||
        c !== originalBookData.category ||
        isbn !== originalBookData.isbn ||
        n !== originalBookData.copies
    );
}

function tryCloseBookModal() {
    if (hasChanges()) {
        document.getElementById('leave-sub-modal').classList.add('open');
    } else {
        document.getElementById('book-modal').classList.remove('open');
        if (editingBookId) {
            showNotification('Action canceled. No changes saved.', 'warning');
        }
    }
}

function closeLeaveSubModal() {
    document.getElementById('leave-sub-modal').classList.remove('open');
}

function forceCloseBookModal() {l
    document.getElementById('leave-sub-modal').classList.remove('open');
    document.getElementById('update-sub-modal').classList.remove('open');
    document.getElementById('add-sub-modal').classList.remove('open');
    document.getElementById('book-modal').classList.remove('open');
    showNotification('Action canceled. No changes saved.', 'warning');
}

function trySaveBook() {
    var title = document.getElementById('modal-title').value.trim();
    var author = document.getElementById('modal-author').value.trim();
    var isbn = document.getElementById('modal-isbn').value.trim();

    if (!title || !author || !isbn) {
        showNotification('Please fill in required fields (Title, Author, ISBN).', 'error');
        return;
    }

    if (editingBookId) {
        if (!hasChanges()) {
            document.getElementById('book-modal').classList.remove('open');
            showNotification('Action canceled. No changes saved.', 'warning');
            return;
        }
        document.getElementById('update-sub-modal').classList.add('open');
    } else {
        document.getElementById('add-sub-modal').classList.add('open');
    }
}

function closeUpdateSubModal() {
    document.getElementById('update-sub-modal').classList.remove('open');
}

function closeAddSubModal() {
    document.getElementById('add-sub-modal').classList.remove('open');
}

function handleAddBook() {
    var title = document.getElementById('modal-title').value.trim();
    var author = document.getElementById('modal-author').value.trim();
    var category = document.getElementById('modal-category').value.trim();
    var isbn = document.getElementById('modal-isbn').value.trim();
    var copies = document.getElementById('modal-copies').value;

    try {
        addBook(title, author, category, isbn, copies, currentUser.id);
        document.getElementById('add-sub-modal').classList.remove('open');
        document.getElementById('book-modal').classList.remove('open');
        showNotification('Book added successfully!', 'success');
        loadDashboardStats();
        loadBookTable();
    } catch(e) {
        showNotification(e.message, 'error');
    }
}

function handleUpdateBook() {
    var title = document.getElementById('modal-title').value.trim();
    var author = document.getElementById('modal-author').value.trim();
    var category = document.getElementById('modal-category').value.trim();
    var isbn = document.getElementById('modal-isbn').value.trim();
    var copies = document.getElementById('modal-copies').value;

    try {
        updateBook(editingBookId, title, author, category, isbn, copies);
        document.getElementById('update-sub-modal').classList.remove('open');
        document.getElementById('book-modal').classList.remove('open');
        showNotification('Book updated successfully!', 'success');
        loadDashboardStats();
        loadBookTable();
    } catch(e) {
        showNotification(e.message, 'error');
    }
}

var deletingBookId = null;

function openDeleteModal(bookId) {
    deletingBookId = bookId;
    document.getElementById('confirm-modal').classList.add('open');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('open');
    deletingBookId = null;
}

function confirmDelete() {
    if (!deletingBookId) return;

    try {
        deleteBook(deletingBookId);
        showNotification('Book deleted.', 'success');
        closeConfirmModal();
        loadBookTable();
        loadDashboardStats();
    } catch(e) {
        showNotification(e.message, 'error');
        closeConfirmModal();
    }
}


function loadBorrowForm() {
    var books = getAllBooks();
    var availableBooks = [];

    for (var i = 0; i < books.length; i++) {
        if (books[i].availableCopies > 0) {
            availableBooks.push(books[i]);
        }
    }

    var sel = document.getElementById('borrow-bookId');
    var options = '<option value="">-- Choose a Book --</option>';

    for (var i = 0; i < availableBooks.length; i++) {
        var b = availableBooks[i];
        options += '<option value="' + b.id + '">' + b.id + ' – ' + b.title + ' (' + b.availableCopies + ' available)</option>';
    }

    sel.innerHTML = options;
}

function handleBorrowBook() {
    var studentId = document.getElementById('borrow-studentId').value.trim();
    var bookId = document.getElementById('borrow-bookId').value;
    var librarianId = document.getElementById('borrow-librarianId').value.trim();

    if (!studentId || !bookId || !librarianId) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    try {
        var tx = borrowBook(bookId, studentId, librarianId);
        showNotification('Book borrowed! Transaction ID: ' + tx.id, 'success');
        document.getElementById('borrow-studentId').value = '';
        document.getElementById('borrow-bookId').value = '';
        loadBorrowForm();
    } catch(e) {
        showNotification(e.message, 'error');
    }
}

function loadReturnForm() {
    var txs = getAllTransactions();
    var activeTxs = [];

    for (var i = 0; i < txs.length; i++) {
        if (txs[i].status === "borrowed" || txs[i].status === "overdue") {
            activeTxs.push(txs[i]);
        }
    }

    var tbody = document.getElementById('active-tx-tbody');

    if (activeTxs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px;">No active borrows.</td></tr>';
        return;
    }

    var rows = '';
    for (var i = 0; i < activeTxs.length; i++) {
        var t = activeTxs[i];
        rows += '<tr>' +
            '<td>' + t.id + '</td>' +
            '<td>' + t.bookId + '</td>' +
            '<td>' + t.studentId + '</td>' +
            '<td>' + formatDate(t.borrowDate) + '</td>' +
            '<td>' + formatDate(t.dueDate) + '</td>' +
            '<td><span class="badge badge-' + t.status + '">' + t.status + '</span></td>' +
        '</tr>';
    }
    tbody.innerHTML = rows;
}

function handleReturnBook() {
    var txId = document.getElementById('return-txId').value.trim();
    var librarianId = document.getElementById('return-librarianId').value.trim();

    if (!txId) {
        showNotification('Please enter a Transaction ID.', 'error');
        return;
    }

    try {
        returnBook(txId, librarianId);
        showNotification('Book returned successfully!', 'success');
        document.getElementById('return-txId').value = '';
        loadReturnForm();
    } catch(e) {
        showNotification(e.message, 'error');
    }
}

function loadTransactionTable() {
    var txs = getAllTransactions();
    var searchEl = document.getElementById('tx-search');
    var query = searchEl ? searchEl.value.toLowerCase() : '';
    var filterEl = document.getElementById('tx-filter');
    var filter = filterEl ? filterEl.value : 'all';

    if (query) {
        var filtered = [];
        for (var i = 0; i < txs.length; i++) {
            var t = txs[i];
            if (t.id.toLowerCase().indexOf(query) !== -1 ||
                t.bookId.toLowerCase().indexOf(query) !== -1 ||
                t.studentId.toLowerCase().indexOf(query) !== -1) {
                filtered.push(t);
            }
        }
        txs = filtered;
    }

    if (filter !== 'all') {
        var filtered2 = [];
        for (var i = 0; i < txs.length; i++) {
            if (txs[i].status === filter) filtered2.push(txs[i]);
        }
        txs = filtered2;
    }

    var tbody = document.getElementById('tx-tbody');

    if (txs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:30px;">No transactions found.</td></tr>';
        return;
    }

    var rows = '';
    for (var i = 0; i < txs.length; i++) {
        var t = txs[i];
        rows += '<tr>' +
            '<td>' + t.id + '</td>' +
            '<td>' + t.bookId + '</td>' +
            '<td>' + t.studentId + '</td>' +
            '<td>' + t.librarianId + '</td>' +
            '<td>' + formatDate(t.borrowDate) + '</td>' +
            '<td>' + formatDate(t.dueDate) + '</td>' +
            '<td>' + (t.returnDate ? formatDate(t.returnDate) : '—') + '</td>' +
            '<td><span class="badge badge-' + t.status + '">' + t.status + '</span></td>' +
        '</tr>';
    }
    tbody.innerHTML = rows;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-CA');
    } catch(e) {
        return dateStr;
    }
}

var toastTimer;

function showNotification(msg, type) {
    var el = document.getElementById('toast');
    var iconWrap = document.getElementById('toast-icon-wrap');
    var msgEl = document.getElementById('toast-msg');

    msgEl.textContent = msg;
    iconWrap.className = 'toast-icon-wrap';

    if (type === 'error') {
        iconWrap.classList.add('error');
        iconWrap.textContent = '✕';
    } else if (type === 'warning') {
        iconWrap.classList.add('warning');
        iconWrap.textContent = '!';
    } else {
        iconWrap.classList.add('success');
        iconWrap.textContent = '✓';
    }

    el.className = 'toast show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
    document.getElementById('toast').className = 'toast';
}

document.getElementById('book-modal').addEventListener('click', function(e) {
    if (e.target === this) tryCloseBookModal();
});

document.getElementById('confirm-modal').addEventListener('click', function(e) {
    if (e.target === this) closeConfirmModal();
});


seedData();

loadDashboardStats();

