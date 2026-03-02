Transaction.js
class Transaction {
	_id;
	_bookId;
	_studentId;
	_librarianId;
	_borrowDate;
	_dueDate;
	_returnDate;
	_status;

	constructor(id, bookId, studentId, librarianId, borrowDate, dueDate) {
		this._id = id;
		this._bookId = bookId;
		this._studentId = studentId;
		this._librarianId = librarianId;
		this._borrowDate = borrowDate;
		this._dueDate = dueDate;
		this._returnDate = null;
		this._status = "borrowed";
	}

	// Getters
	getId() {
		return this._id;
	}

	getBookId() {
		return this._bookId;
	}

	getStudentId() {
		return this._studentId;
	}

	getLibrarianId() {
		return this._librarianId;
	}

	getBorrowDate() {
		return this._borrowDate;
	}

	getDueDate() {
		return this._dueDate;
	}

	getReturnDate() {
		return this._returnDate;
	}

	getStatus() {
		return this._status;
	}

	// Setters
	setReturnDate(returnDate) {
		this._returnDate = returnDate;
	}

	setStatus(status) {
		let valid = ["borrowed", "returned", "overdue"];
		if (valid.indexOf(status) === -1) {
			throw new Error("Invalid status value.");
		} 

		this._status = status;
	}

	toObject() {
		return {
		  id: this._id,
		  bookId: this._bookId,
		  studentId: this._studentId,
		  librarianId: this._librarianId,
		  borrowDate: this._borrowDate,
		  dueDate: this._dueDate,
		  returnDate: this._returnDate,
		  status: this._status
		};
	}

	static fromObject(obj) {
		// Convert plain data from the storage back into a real Transaction object
	    let tx = new Transaction(
	        obj.id, 
	        obj.bookId, 
	        obj.studentId, 
	        obj.librarianId, 
	        obj.borrowDate, 
	        obj.dueDate
	    );
	    tx.returnDate = obj.returnDate;
	    tx.status = obj.status;
	    return tx;
	}

	static generateId(existingTransactions) {
		// Create a unique ID
	    let prefix = "TX";
	    let nextNum = existingTransactions.length + 1;
	    let idString = "";

	    // Add zeros so the ID always has 4 digits
	    if (nextNum < 10) {
	    	idString = "000" + nextNum;
	    } else if (nextNum < 100) { 
	    	idString = "00" + nextNum;
		} else if (nextNum < 1000) { 
	   		idString = "0" + nextNum;
	    } else {
	    	idString = nextNum; 
	    }

	    return prefix + idString;
	}

	static getAll() {
	    let data = localStorage.getItem("transactions");
	    if (!data) {
	    	return [];
	    }
	    let rawArray = JSON.parse(data);
	    let txInstances = [];
	    for (let i = 0; i < rawArray.length; i++) {
	        txInstances.push(Transaction.fromObject(rawArray[i]));
	    }
	    return txInstances;
	}

	static saveAll(transArray) {
	    let plainObjects = [];
	    for (let i = 0; i < transArray.length; i++) {
	        plainObjects.push(transArray[i].toObject());
	    }
	    localStorage.setItem("transactions", JSON.stringify(plainObjects));
	}

	static borrowBook(bookId, studentId, librarianId) {
	    let transactions = Transaction.getAll();
	    
	    // Check if the student is already holding a copy of this specific book
	    for (let i = 0; i < transactions.length; i++) {
	        if (transactions[i].studentId === studentId && 
	            transactions[i].bookId === bookId && 
	            transactions[i].status === "borrowed") {
	            throw new Error("Error: Student already has an active borrow for this book.");
	        }
	    }

	    // Try to reduce the book count. If Book.js says no, we stop here.
        try {
            Book.decrementAvailable(bookId);
        } catch (err) {
            throw new Error("Borrow Failed: no copies available");
        }

	    let now = new Date();
	    let borrowDate = now.toISOString();
	    
	    // Automatically set the deadline to 7 days from today
	    let due = new Date();
	    due.setDate(now.getDate() + 7); 
	    let dueDate = due.toISOString();

	    let newId = Transaction.generateId(transactions);
	    let newTx = new Transaction(newId, bookId, studentId, librarianId, borrowDate, dueDate);

	    // Save the new borrow record to the list
	    transactions.push(newTx);
	    Transaction.saveAll(transactions);
	    return "Success";
	}

	static returnBook(transactionId, librarianId) {
	    let transactions = Transaction.getAll();
	    let found = false;

	    for (let i = 0; i < transactions.length; i++) {
	        if (transactions[i].id === transactionId) {
	        	// Mark as returned and record the exact time it was brought back it was brought back
	            transactions[i].status = "returned";
	            transactions[i].returnDate = new Date().toISOString();
	            
	            // Put the book back into the library inventory
	            Book.incrementAvailable(transactions[i].bookId);
	            found = true;
	            break;
	        }
	    }

	    if (found) {
	        Transaction.saveAll(transactions);
	        return "Success";
	    }
	    throw new Error("Transaction not found.");
	}

	static getByStudent(studentId) {
	    let all = Transaction.getAll();
	    let results = [];
	    for (let i = 0; i < all.length; i++) {
	        if (all[i].studentId === studentId) {
	            results.push(all[i]);
	        }
	    }
	    return results;
	}

	// ADDED: Missing method from requirements
	static getByBook(bookId) {
	    let all = Transaction.getAll();
	    let results = [];
	    for (let i = 0; i < all.length; i++) {
	        if (all[i].bookId === bookId) {
	            results.push(all[i]);
	        }
	    }
	    return results;
	}

	static getActive() {
	    let all = Transaction.getAll();
	    let results = [];
	    for (let i = 0; i < all.length; i++) {
	        if (all[i].status === "borrowed" || all[i].status === "overdue") {
	            results.push(all[i]);
	        }
	    }
	    return results;
	}

	static checkOverdue() {
	    let all = Transaction.getAll();
	    let today = new Date();
	    let updatedCount = 0;

	    for (let i = 0; i < all.length; i++) {
	    	// Only check the books that haven't been returned yet
	        if (all[i].status === "borrowed") {
	            let dueDate = new Date(all[i].dueDate);
	            // If today's date has past the deadline, it will mark as overdue
	            if (today > dueDate) {
	                all[i].status = "overdue";
	                updatedCount++;
	            }
	        }
	    }
	    if (updatedCount > 0) Transaction.saveAll(all);
	    return updatedCount + " transactions updated to overdue.";
	}

	static generateReport() {
	    let all = Transaction.getAll();
	    let report = {
	        totalBorrowed: 0,
	        totalReturned: 0,
	        totalOverdue: 0,
	        mostBorrowedBook: "None"
	    };

	    let bookCounts = {};

	    for (let i = 0; i < all.length; i++) {
	        if (all[i].status === "returned") report.totalReturned++;
	        if (all[i].status === "overdue") report.totalOverdue++;
	        report.totalBorrowed++;

	        // Keep track of how many times each book ID appears
	        let bId = all[i].bookId;
	        if (bookCounts[bId]) {
	            bookCounts[bId]++;
	        } else {
	            bookCounts[bId] = 1;
	        }
	    }

	    // Find which book ID has the highest count
	    let max = 0;
	    for (let id in bookCounts) {
	        if (bookCounts[id] > max) {
	            max = bookCounts[id];
	            report.mostBorrowedBook = id;
	        }
	    }

	    return report;
	}
}