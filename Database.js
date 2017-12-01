/*jslint browser:true, esnext:true*/
/*global Item*/
class Database {
	constructor() {
//		window.indexedDB.deleteDatabase(this.databaseName);
		this.openDB(function() {
		});
	}
	openDB(callback) {
		var DBOpenRequest;
		DBOpenRequest = window.indexedDB.open(this.databaseName, Database.version);
		DBOpenRequest.obj = this;
		Database.addEventListeners(DBOpenRequest, Database.evt.IDBOpenDBRequest);
		if (callback) {
			DBOpenRequest.addEventListener("success", callback);
		}
		return this;
	}
	static setEvents() {
//		var target = this;
		this.evt = {
			IDBOpenDBRequest: {
				blocked: function () {
					throw "Ouverture de la bd bloquée";	//TODO Voir l'utilité
				},
				error: function () {
					throw "Erreur de connexion a la bd";
				},
				success: function () {
					console.log("DBOpenRequest:success");
					this.obj.stores.forEach(function (e) {
    					/*jslint evil:true*/
						eval(e).db = this.result;
    					/*jslint evil:false*/
					}, this);
					//					var transaction, itemsObjectStore, request;
					Item.getAll(function() {
						var cntr = document.querySelector("section.body");
						this.result.forEach(function (o) {
							cntr.appendChild(o.DOM_create());
						});
					});
					this.obj.db = this.result;
				},
				upgradeneeded: function () {
					console.log("DBOpenRequest:upgradeneeded");
					var db = this.result;
					this.obj.stores.forEach(function (e) {
    					/*jslint evil:true*/
						eval(e).createStore(db);
    					/*jslint evil:false*/
					}, this);
				}
			},
			IDBDatabase: {
				abort: function () {
					throw "Ouverture de la bd bloquée";	//TODO Voir l'utilité
				},
				error: function () {
					throw "Erreur de connexion a la bd";
				},
				close: function () {
					console.log("IDBDatabase:close");
				},
				versionchange: function () {
					console.log("IDBDatabase:versionchange"); //TODO Implémenter et comprendre
				}
			},
			IDBTransaction: {
				abort: function () {
					throw "IDBTransaction:abort";	//TODO Voir l'utilité
				},
				error: function () {
					throw "IDBTransaction:error";
				},
				complete: function () {
					console.log("IDBTransaction:complete");
				}
			}
		};
	}
	static addEventListeners(obj, evts) {
		var k;
		for( k in evts) {
			obj.addEventListener(k, evts[k]);
		}
		return this;
	}
	static init() {
		this.version = 1;
		this.setEvents();
		this.prototype.stores = [];
	}
}
Database.init();
