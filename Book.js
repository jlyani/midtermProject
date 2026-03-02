Book.js
class Book {
	_id;
	_title;
	_author;
	_category;
	_isbn;
	_totalCopies;
	_availableCopies;
	_addedBy;
	_createdAt;

	constructor(id, title, author, category, isbn, totalCopies, addedBy) {
		this._id = id;
		this._title = title;
		this._author = author;
		this._category = category;
		this._isbn = isbn;
		this._totalCopies = totalCopies;
		this._availableCopies = totalCopies;
		this._addedBy = addedBy;
		this._createdAt = new Date().toLocaleString("en-CA", {
											  timeZone: "Asia/Manila",
											  year: "numeric",
											  month: "2-digit",
											  day: "2-digit",
											  hour: "2-digit",
											  minute: "2-digit",
											  second: "2-digit",
											  hour12: false
											});
	}

	// Getters
	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	get author() {
		return this._author;
	}

	get category() {
		return this._category;
	}

	get isbn() {
		return this._isbn;
	}

	get totalCopies() {
		return this._totalCopies;
	}

	get availableCopies() {
		return this._availableCopies;
	}

	get addedBy() {
		return this._addedBy;
	}

	get createdAt() {
		return this._createdAt;
	}

	// Setters
	setTitle(title) {
		if (!title || title.trim() === "") {
			throw new Error("Title cannot be empty.");
		}

		this._title = title.trim();
	}

	setAuthor(author) {
		if (!author || author.trim() === "") {
			throw new Error("Author cannot be empty.");
		}

		this._author = author.trim();
	}

	setCategory(category) {
		if (!category || category.trim() === "") {
			throw new Error("Category cannot be empty.");
		}

		this._category = category.trim();
	}

	setIsbn(isbn) { 
		this._isbn = isbn ? isbn.trim() : "";
	}

	setTotalCopies(totalCopies) {
		let n = parseInt(totalCopies, 10);
		if (isNaN(n) || n < 1) {
			throw new Error("Total copies must be at least 1.");
		}

		this._totalCopies = n;
	}

	setAvailableCopies(availableCopies) {
		this._availableCopies = parseInt(availableCopies, 10); 
	}

	toObject() {
		return {
			id: this._id,
			title: this._title,
			author: this._author,
			category: this._category,
			isbn: this._isbn,
			totalCopies: this._totalCopies,
			availableCopies: this._availableCopies,
			addedBy: this._addedBy,
			createdAt: this._createdAt
		}
	}

	static fromObject(obj) {
		let book = new Book(obj.id, obj.title, obj.author, obj.category, obj.isbn, obj.totalCopies, obj.addedBy);
		book.availableCopies = obj.availableCopies;
		book._setCreatedAt(obj.createdAt);
		return book;
	}

	_setCreatedAt(date) {
		this._createdAt = date;
	}

	static generatedId(existingBooks) {
		// Create a unique ID
		let prefix = "BK";
		let nextNum = existingBooks.length + 1;
		let idString = "";

		// Add zeros so the ID always has 4 digits
		if(nextNum < 10) {
			idString = "000" + nextNum;
		} else if(nextNum < 100) {
			idString = "00" + nextNum;
		} else if(nextNum < 1000) {
			idString = "0" + nextNum;
		} else {
			idString = nextNum;
		}

		return prefix + idString;
	}

	static getAll() {
		// Retrieve all books from the browser's storage
	    const data = localStorage.getItem("books");
	    if (!data) {
	    	return [];
	    }

	    const rawArray = JSON.parse(data);
	    const bookInstances = [];

	    for (let i = 0; i < rawArray.length; i++) {
	        // Convert each piece of data into a real Book object
	    	let book = Book.fromObject(rawArray[i]);
	        bookInstances.push(book);
	    }

	    return bookInstances;
	}

	static saveAll(booksArray) {
		// Convert all Book objects into a list and save to storage
	    const plainObjects = [];

	    // Loop through the list of Book instances
	    for (let i = 0; i < booksArray.length; i++) {
	    	// Convert each smart Book back into a plain data object
	    	let plainObj = booksArray[i].toObject();
	        // Add it to our list of things to save
	        plainObjects.push(plainObj);
	    }

	    // Save the final string to localStorage
	    localStorage.setItem("books", JSON.stringify(plainObjects));
	}

	// REQUIRED with TRANSACTIONS: Decrement when borrowing
	static decrementAvailable(bookId) {
		// Reduce the count when a book is borrowed
	    let books = Book.getAll();
	    for (let i = 0; i < books.length; i++) {
	        if (books[i].id === bookId) {
	            if (books[i].availableCopies > 0) {
	                books[i].availableCopies -= 1;
	                Book.saveAll(books);
	                return true;
	            }
	            throw new Error("Inventory Error: No copies are available for withdrawal."); // No copies left
	        }
	    }
	    throw new Error("Database Error: Book ID not found."); // Book not found
	}

	// REQUIRED FOR TRANSACTIONS: Increment when returning
	static incrementAvailable(bookId) {
		// Increase the count when a book is returned
	    let books = Book.getAll();
	    for (let i = 0; i < books.length; i++) {
	        if (books[i].id === bookId) {
	            if (books[i].availableCopies < books[i].totalCopies) {
	                books[i].availableCopies += 1;
	                Book.saveAll(books);
	                return true;
	            }
	        }
	    }
	    return false;
	}

	static addBook(title, author, category, isbn, totalCopies, addedBy) {
		if(!title || !author || !isbn) {
			throw new Error("Error: Required fields are missing.");
		}

		let books = Book.getAll();
		let newId = Book.generatedId(books);
		let newBook = new Book(newId, title, author, category, isbn, totalCopies, addedBy);

		books.push(newBook);
		Book.saveAll(books);
		return newBook;
	}

	static deleteBook(bookId) {
		let books = Book.getAll();
		let bookIndex = -1;

		// Find the position of the book in our list
		for(let index = 0; index < books.length; index++) {
			if(books[index].id === bookId) {
				bookIndex = index;
				break;
			}
		}

		if(bookIndex === -1) {
			throw new Error("Delete Failed: The Book is not found.");
		}

		let selectedBook = books[bookIndex];
		if(selectedBook.availableCopies < selectedBook.totalCopies) {
			throw new Error("Cannot delete the book. This book has active borrows."); 
		}

		books.splice(bookIndex, 1);

		Book.saveAll(books);
		return "Success";
	}
}