
var rhit = rhit || {};

rhit.FB_COLLECTION_PHOTO = "Photo";
rhit.FB_KEY_URL = "url";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FbPhotoBucketManager = null;


// from https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

rhit.ListPageController = class{

	constructor(){
		console.log("Created ListPageController");
		document.querySelector("#submit").onclick = (event) =>{
			const url = document.querySelector("#inputPicture").value;
			const caption = document.querySelector("#inputCaption").value;

			rhit.FbPhotoBucketManager.add(url,caption);
		};

        //pre animation
		$("#addPicture").on("show.bs.modal", (event) => {

			document.querySelector("#inputPicture").value = "";
			document.querySelector("#inputCaption").value = "";
	
		})
		//post animation
			$("#addPicture").on("shown.bs.modal", (event) =>{

			document.querySelector("#inputPicture").focus();

		})

		//Start Listening
		rhit.FbPhotoBucketManager.beginListening(this.updateList.bind(this));
	}

	_createCard(photo){
		return htmlToElement(`
		
    		<div class="pin" id="${photo.id}">
			<img src="${photo.url}" alt="${photo.caption}">
        		<p class="caption">${photo.caption}</p>
    		</div>


		`);
	}

	updateList(){
		console.log("I need to update the list on the page!");
		console.log(`${rhit.FbPhotoBucketManager.length}`);
		console.log(rhit.FbPhotoBucketManager.getUrlAtIndex(0));
		
		
		//Make a new quoteListContainer
		const newList = htmlToElement('<div id="columns"></div>');

		//Fill the quoteListContainer with quote cards using a loop
		for(let i = 0; i<rhit.FbPhotoBucketManager.length; i++){
			const ph = rhit.FbPhotoBucketManager.getUrlAtIndex(i);
			const newCard = this._createCard(ph);

			newList.appendChild(newCard);



		}



		//Remove the old quoteListContainer
		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		//Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);
	}

}

rhit.PhotoBucket = class{
	constructor(id,url,caption){
		this.id = id;
		this.url = url;
		this.caption = caption;
	}
}

rhit.FbPhotoBucketManager = class{
	constructor() {
		console.log("Created FbPhotoBucketManager");

		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTO);
	}

	add(url,caption){
		console.log(url);
		console.log(caption);

		this._ref.add({
			[rhit.FB_KEY_URL]:url,
			[rhit.FB_KEY_CAPTION]:caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function (docRef){
			console.log("Docuent written with ID: ", docRef.id);
		})
		.catch(function(error){

			console.log("Error adding document", error);

		})

	}
	beginListening(changeListener){
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
	stopListening(){
		this._unsubscribe();
	}
	update(id,caption){

	}
	delete(id){

	}
	get length(){
		return this._documentSnapshots.length;
	}

	getUrlAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const pic = new rhit.PhotoBucket(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_URL),
			docSnapshot.get(rhit.FB_KEY_CAPTION)
		)
		return pic;
	}


}





/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if(document.querySelector("#listPage")){

		console.log("You are on the List Page");
		rhit.FbPhotoBucketManager = new rhit.FbPhotoBucketManager();
		new rhit.ListPageController();

	}



};

rhit.main();
