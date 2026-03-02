Storage.js
// array to store dummy datas
let studentArray = [];
let adminArray = [];
let librarianArray = [];
let bookArray = [];
let transactionArray = [];

// function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// loads dummy data from localStorage, if the local storage is empty return an empty array
function loadData(key) {
    let data = localStorage.getItem(key);
    if (data == null) {
        // if local storage is empty return an empty array
        return "Local Storage is empty";
    }
    //    returns the parsed data from local storage
    return JSON.parse(data);
}
// clears specific data from localStorage using key
function clearSpecificData(key) {
    localStorage.removeItem(key);
}
// clears all data from localStorage
function clearLocalStorage() {
    localStorage.clear();
}

// loads dummy datas from local storage if the local storage is empty
function seedData() {
    if (
        localStorage.getItem("elib_admins") &&
        localStorage.getItem("elib_librarians") &&
        localStorage.getItem("elib_students") &&
        localStorage.getItem("elib_books") &&
        localStorage.getItem("elib_transactions")
    ) {
        return;
    }
    saveData("elib_students", studentArray);
    saveData("elib_librarians", librarianArray);
    saveData("elib_admins", adminArray);
    saveData("elib_books", bookArray);
    saveData("elib_transactions", transactionArray);
}

// dummy datas for admin
adminArray.push(
    new Administrator(
        "AD0001",
        "Admin User",
        "admin@elibrary.com",
        "admin123",
    ).toObject(),
);

// dummy data for librarians
librarianArray.push(
    new Librarian(
        "LB0001",
        "Maria Santos",
        "maria@elibrary.com",
        "lib123",
    ).toObject(),
);

librarianArray.push(
    new Librarian(
        "LB0002",
        "Jose Reyes",
        "jose@elibrary.com",
        "lib123",
    ).toObject(),
);

// dummy datas for students
studentArray.push(
    new Student(
        "SD0001",
        "Juan dela Cruz",
        "juan@student.com",
        "student123",
        "BSIT",
        "2nd Year",
    ).toObject(),
);

studentArray.push(
    new Student(
        "SD0002",
        "Ana Gomez",
        "ana@student.com",
        "student123",
        "BSCS",
        "3rd Year",
    ).toObject(),
);

studentArray.push(
    new Student(
        "SD0003",
        "Carlo Bautista",
        "carlo@student.com",
        "student123",
        "BSIT",
        "1st Year",
    ).toObject(),
);

// dummy datas for books
bookArray.push(
    new Book(
        "BK0001",
        "Clean Code",
        "Robert C. Martin",
        "Programming",
        "978-0-13-235088-4",
        5,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0002",
        "The Pragmatic Programmer",
        "Andrew Hunt",
        "Programming",
        "978-0-13-595705-9",
        4,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0003",
        "You Don't Know JS",
        "Kyle Simpson",
        "Programming",
        "978-1-491-92446-4",
        5,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0004",
        "Python Crash Course",
        "Eric Matthes",
        "Programming",
        "978-1-593-27603-4",
        4,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0005",
        "Design Patterns",
        "Erich Gamma",
        "Programming",
        "978-0-20-163361-5",
        3,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0006",
        "Sapiens: A Brief History of Humankind",
        "Yuval Noah Harari",
        "History",
        "978-0-06-231609-7",
        5,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0007",
        "Thinking, Fast and Slow",
        "Daniel Kahneman",
        "Psychology",
        "978-0-374-53355-7",
        3,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0008",
        "A Brief History of Time",
        "Stephen Hawking",
        "Science",
        "978-0-553-38016-3",
        4,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0009",
        "The Art of War",
        "Sun Tzu",
        "Philosophy",
        "978-1-59030-225-5",
        4,
        "AD0001",
    ).toObject(),
);

bookArray.push(
    new Book(
        "BK0010",
        "The Intelligent Investor",
        "Benjamin Graham",
        "Finance",
        "978-0-06-055566-5",
        3,
        "AD0001",
    ).toObject(),
);

// dummy datas for transactions
let transaction1 = new Transaction(
    "TX0001",
    "BK0001",
    "SD0001",
    "LB0001",
    "2025-01-15",
    "2025-01-29",
);
// manually updating the status and return date of transaction1
transaction1._status = "returned";
transaction1._returnDate = "2025-01-28";

transactionArray.push(transaction1.toObject());

let transaction2 = new Transaction(
    "TX0002",
    "BK0003",
    "SD0002",
    "LB0001",
    "2025-03-10",
    "2025-03-24",
);

// manually updating the status of transaction2
transaction2._status = "overdue";
transactionArray.push(transaction2.toObject());

transactionArray.push(
    new Transaction(
        "TX0003",
        "BK0005",
        "SD0003",
        "LB0002",
        "2025-06-05",
        "2025-06-19",
    ).toObject(),
);

transactionArray.push(
    new Transaction(
        "TX0004",
        "BK0007",
        "SD0001",
        "LB0002",
        "2025-09-20",
        "2025-10-04",
    ).toObject(),
);

transactionArray.push(
    new Transaction(
        "TX0005",
        "BK0009",
        "SD0002",
        "LB0001",
        "2026-01-10",
        "2026-01-24",
    ).toObject(),
);

// used to check the array elements 
console.log(adminArray);
console.log(librarianArray);
console.log(studentArray);
console.log(bookArray);
console.log(transactionArray);

//call seed data function to populate local storage with dummy datas
seedData();