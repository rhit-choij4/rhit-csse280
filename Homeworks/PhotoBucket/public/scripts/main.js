var rhit = rhit || {};

rhit.FB_COLLECTION_PHOTO = "Photo";
rhit.FB_KEY_URL = "url";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FbPhotoBucketManager = null;
rhit.FbSingleUrlManager = null;


// from https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {

	constructor() {
		console.log("Created ListPageController");
		document.querySelector("#submit").onclick = (event) => {
			const url = document.querySelector("#inputPicture").value;
			const caption = document.querySelector("#inputCaption").value;

			rhit.FbPhotoBucketManager.add(url, caption);
		};

		//pre animation
		$("#addPicture").on("show.bs.modal", (event) => {

			document.querySelector("#inputPicture").value = "";
			document.querySelector("#inputCaption").value = "";

		})
		//post animation
		$("#addPicture").on("shown.bs.modal", (event) => {

			document.querySelector("#inputPicture").focus();

		})

		//Start Listening
		rhit.FbPhotoBucketManager.beginListening(this.updateList.bind(this));
	}

	_createCard(photo) {
		return htmlToElement(`
		
    		<div class="pin" id="${photo.id}">
			<img src="${photo.url}" alt="${photo.caption}" class = "img-fluid">
        		<p class="caption">${photo.caption}</p>
    		</div>


		`);
	}

	updateList() {
		console.log("I need to update the list on the page!");
		console.log(`${rhit.FbPhotoBucketManager.length}`);
		console.log(rhit.FbPhotoBucketManager.getUrlAtIndex(0));


		const newList = htmlToElement('<div id="columns"></div>');

		for (let i = 0; i < rhit.FbPhotoBucketManager.length; i++) {
			const ph = rhit.FbPhotoBucketManager.getUrlAtIndex(i);
			const newCard = this._createCard(ph);

			newCard.onclick = (event) => {
				// rhit.storage.setUrlId(ph.id);

				window.location.href = `/detailPage.html?id=${ph.id}`;
			}



			newList.appendChild(newCard);



		}



		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}

}

rhit.PhotoBucket = class {
	constructor(id, url, caption) {
		this.id = id;
		this.url = url;
		this.caption = caption;
	}
}

rhit.FbPhotoBucketManager = class {
	constructor() {
		console.log("Created FbPhotoBucketManager");

		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTO);
	}

	add(url, caption) {
		console.log(url);
		console.log(caption);

		this._ref.add({
				[rhit.FB_KEY_URL]: url,
				[rhit.FB_KEY_CAPTION]: caption,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Docuent written with ID: ", docRef.id);
			})
			.catch(function (error) {

				console.log("Error adding document", error);

			})

	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.
		limit(50).
		orderBy(rhit.FB_KEY_LAST_TOUCHED).
		onSnapshot((querySnapshot) => {

			console.log("PhotoBucket update!");
			this._documentSnapshots = querySnapshot.docs;

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	update(id, caption) {

	}
	delete(id) {

	}
	get length() {
		return this._documentSnapshots.length;
	}

	getUrlAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const pic = new rhit.PhotoBucket(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_URL),
			docSnapshot.get(rhit.FB_KEY_CAPTION)
		)
		return pic;
	}


}

rhit.DetailPageController = class {
	constructor() {

		document.querySelector("#submitEdit").onclick = (event) => {
			const caption = document.querySelector("#inputCaption").value;

			rhit.FbSingleUrlManager.update(caption);
		};

		//pre animation
		$("#editCaption").on("show.bs.modal", (event) => {

			document.querySelector("#inputCaption").value = rhit.FbSingleUrlManager.caption;

		})
		//post animation
		$("#editCaption").on("shown.bs.modal", (event) => {

			document.querySelector("#inputCaption").focus();

		})

		document.querySelector("#submitDelete").addEventListener("click", (event)  => {

			rhit.FbSingleUrlManager.delete().then(() => {
				console.log("Document successfully deleted!");
				window.location.href = "/";
			}).catch((error) => {
				console.error("Error removing document: ", error);
			});




		});



		
		rhit.FbSingleUrlManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardUrl").src = rhit.FbSingleUrlManager.url;
		document.querySelector("#cardCaption").innerHTML = rhit.FbSingleUrlManager.caption;
	}
}

rhit.FbSingleUrlManager = class {
	constructor(pictureId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTO).doc(pictureId);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot= doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});

	}
	stopListening() {
		this._unsubscribe();
	}
	update(caption) {
		this._ref.update({

			[rhit.FB_KEY_CAPTION]:caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(() =>{
			console.log("Document Successfully updated");
		})
		.catch(function(error){

			console.log("Error updating document", error);

		})

	}
	delete() {
		return this._ref.delete();
	}

	get url(){
		return this._documentSnapshot.get(rhit.FB_KEY_URL);
	}

	get caption(){
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}

}




/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#listPage")) {

		console.log("You are on the List Page");
		rhit.FbPhotoBucketManager = new rhit.FbPhotoBucketManager();
		new rhit.ListPageController();

	}

	if (document.querySelector("#detailPage")) {

		console.log("Detail");

		// const urlId = rhit.storage.getUrlId();
		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const urlId = urlParams.get("id");


		console.log(`for ${urlId}`);
		if(!urlId){
			window.location.href = "/";
		}
		rhit.FbSingleUrlManager = new rhit.FbSingleUrlManager(urlId);
		new rhit.DetailPageController();


	}





};

rhit.main();