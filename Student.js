Student.js
class Student extends User {
	_course;
	_year;

	constructor(name, email, password, course, year) {
		super(undefined, name, email, password, "student");

		this._course = course;
		this._year = year;
		this._id = this.generateId(JSON.parse(localStorage.getItem("elib_students")));
	}

	// Getters
	getCourse() {
		return this._course;
	}

	getYear() {
		return this._year; 
	}
	
	// Setters
	setCourse(course) {
		if (!course || course.trim() === "") {
			throw new Error("Course cannot be empty.");
		}

		this._course = course.trim();
	}

	setYear(year) {
		if (!year || year.trim() === "") {
			throw new Error("Year level cannot be empty.");
		}

		this._year = year.trim();
	}

	toObject() {
		// Save base user data and add student information fields
		let base = super.toObject();
		base.course = this._course;
		base.year = this._year;
		
		return base;
	}

	static fromObject(obj) {
		// Rebuild student object from saved data
		const student = new Student(obj.name, obj.email, obj.password, obj.course, obj.year);
		return student;
	}

	generateId(existingStudents) {
		// Create a unique ID
		let prefix = "SD";
		let nextNumber = existingStudents.length + 1;
		let idString = "";

		// Add zeros so the ID always has 4 digits
		if(nextNumber < 10) {
			idString = "000" + nextNumber;
		} else if(nextNumber < 100) {
			idString = "00" + nextNumber;
		} else if(nextNumber < 1000) {
			idString = "0" + nextNumber;
		} else {
			idString = nextNumber;
		}

		return prefix + idString;
	}
}