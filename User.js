User.js
class User {
	// I used "_" to make it a protected field,
	// meaning it is accessible within this class
	// and it's child classes
	_id;
	_fullName;
	_email;
	_password;
	_role; // "student" | "librarian" | "administrator"
	_createdAt;

	constructor(id, fullName, email, password, role, createdAt) {
		this._id = id;
		this._fullName = fullName;
		this._email = email;
		this._password = password;
		this._role = role;
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
	getId() {
		return this._id;
	}

	getFullName() {
		return this._fullName;
	}

	getEmail() {
		return this._email;
	}

	getPassword() {
		return this._password;
	}

	getRole() {
		return this._role;
	}

	getCreatedAt() {
		return this._createdAt;
	}

	// Setters
	setName(name) {
		if (!name || name.trim() === "") {
			throw new Error("Name cannot be empty.");
		}

		this._fullName = name.trim();
	}

	setEmail(email) {
		if (!email || email.trim() === "") {
			throw new Error("Email cannot be empty.");
		}

		this._email = email.trim().toLowerCase();
	}

	setPassword(password) {
		if (!password || password.length < 6) {
			throw new Error("Password must be at least 6 characters.");
		}
		
		this._password = password;
	}

	toObject() {
		// Convert user data into a simple object for storage
		return {
			id: this._id,
			name: this._fullName,
			email: this._email,
			password: this._password,
			role: this._role,
			createdAt: this._createdAt
		};
	}

	static fromObject(obj) {
		// Rebuild the User instance from saved storage data
		const user = new User(obj.id, obj.name, obj.email, obj.password, obj.role);
		if (obj.createdAt) {
			user._setCreatedAt(obj.createdAt);
		}
		return user;
	}

	_setCreatedAt(date) {
		// Manually update the creation date from the saved records
		this._createdAt = date;
	}
}