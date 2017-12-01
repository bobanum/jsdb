/*jslint browser:true, esnext:true*/
class Store {
	constructor(id) {
		this.id = id;
	}
	static getAll(callback) {
		console.log("Store:getAll");
		var objectStore, request;
		objectStore = this.openStore("readonly");
		request = objectStore.getAll();
		request.obj = this;
		request.addEventListener("success", function() {
			this.result.forEach(function(o) {
				Object.setPrototypeOf(o, this.obj.prototype);
			}, this);
		});
		if (callback) {
			request.addEventListener("success", callback);
		}
		request.addEventListener("error", function() {
			console.log(this.result);
		});
		return request;
	}
	static add(obj) {
		var result;
		result = this.openStore("readwrite");
		result.add(obj);
		return result;
	}
	static openTransaction(type) {
		var result;
		result = this.db.transaction(this.storeName, type);
		return result;
	}
	static openStore(type, transaction) {
		var result;
		transaction = transaction || this.openTransaction(type);
		result = transaction.objectStore(this.storeName);
		return result;
	}
	static createId() {
		var result, enthropy = 5;
		result = Math.pow(10, enthropy-1); //Pour s'assurer de ne pas commencer avec un 0;
		result += Math.floor(Math.random()*Math.pow(10, enthropy)-Math.pow(10, enthropy-1));
		result *= Math.pow(2,31);
		result += new Date().getTime();
		result = result.toString(36);
		return result;
	}
	static createStore(db) {
		this.db = db;
		var result = db.createObjectStore(this.storeName, {keyPath: "id"});
		return result;
	}
	static init() {
		this.storeName = "stores";
	}
}
Store.init();
