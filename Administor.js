Administrator.js
class Administrator extends User {
	constructor(name, email, password) {
		// Pass info from parent User class to child administrator class
		super(undefined, name, email, password, "administrator");

		this._id = this.generateId(JSON.parse(localStorage.getItem("elib_students")));
	}

	toObject() {
		// Convert to a simple object using the parent class
		return super.toObject();
	}

	static fromObject(obj) {
		// Make sure the data is complete before trying to load it
		if (!obj.id || !obj.email) {
	       throw new Error("Failed to load Administrator: Incomplete data.");
	    }
	    // Create a new Administrator instance from the saved data
	    return new Administrator(obj.id, obj.name, obj.email, obj.password);
	}

	generateId(existingAdmins) {
		// Create a unique ID
		let prefix = "AD";
		let nextNumber = existingAdmins.length + 1;
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