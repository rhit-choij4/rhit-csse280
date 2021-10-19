var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FbMovieQuotesManager = null;
rhit.FbSingleQuoteManager = null;
rhit.FbAuthManager = null;


// from https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}







rhit.Controller = class {
	constructor() {
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {

			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;

			rhit.FbMovieQuotesManager.add(quote, movie);
		});
		//pre animation
		$("#addQuoteDialog").on("show.bs.modal", (event) => {

			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";

		})

		//post animation
		$("#addQuoteDialog").on("shown.bs.modal", (event) => {

			document.querySelector("#inputQuote").focus();

		})

		//Start Listening
		rhit.FbMovieQuotesManager.beginListening(this.updateList.bind(this));

	}

	_createCard(MovieQuote) {
		return htmlToElement(`
			
			<div class="card">
				<div class="card-body">
			 		<h5 class="card-title">${MovieQuote.quote}</h5>
			 		<h6 class="card-subtitle mb-2 text-muted">${MovieQuote.movie}</h6>
				</div>
		  	</div>

			`);
	}

	updateList() {
		console.log("I need to update the list on hte page!");
		console.log(`Num quotes = ${rhit.FbMovieQuotesManager.length}`);
		console.log(`Example quotes = `, rhit.FbMovieQuotesManager.getMovieQuoteAtIndex(0));

		//Make a new quoteListContainer
		const newList = htmlToElement(' <div id = "quoteListContainer"></div>');

		//Fill the quoteListContainer with quote cards using a loop
		for (let i = 0; i < rhit.FbMovieQuotesManager.length; i++) {
			const mq = rhit.FbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);

			newCard.onclick = (event) => {
				// console.log(`You clicked on ${mq.id} `);
				// rhit.storage.setMovieQuoteId(mq.id);


				window.location.href = `/moviequote.html?id=${mq.id}`;


			};

			newList.appendChild(newCard);

		}

		//Remove the old quoteListContainer
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		//Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);

	}

}

rhit.MovieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class {
	constructor() {
		console.log("Created FBMovieQuotesManager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		this._unsubscribe = null;
	}
	add(quote, movie) {
		console.log(quote);
		console.log(movie);

		this._ref.add({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
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

			console.log("MovieQuote update!");
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

	// update(id, quote, movie) {    }
	// delete(id) { }
	get length() {
		return this._documentSnapshots.length;
	}
	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE));
		return mq;
	}
}

rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {

			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;

			rhit.FbSingleQuoteManager.update(quote, movie);
		});
		//pre animation
		$("#editQuoteDialog").on("show.bs.modal", (event) => {

			document.querySelector("#inputQuote").value = rhit.FbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.FbSingleQuoteManager.movie;

		})

		//post animation
		$("#editQuoteDialog").on("shown.bs.modal", (event) => {

			document.querySelector("#inputQuote").focus();

		})

		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {

			rhit.FbSingleQuoteManager.delete().then(() => {
				console.log("Document successfully deleted!");
				window.location.href = "/";
			}).catch((error) => {
				console.error("Error removing document: ", error);
			});




		});


		rhit.FbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.FbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.FbSingleQuoteManager.movie;

	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
		console.log(`Listening to ${this._ref.path}`)
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
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
	update(quote, movie) {

		this._ref.update({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(() => {
				console.log("Document Successfully updated");
			})
			.catch(function (error) {

				console.log("Error updating document", error);

			})

	}
	delete() {

		return this._ref.delete();

	}

	get quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}
	get movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}
}



// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteId";
// rhit.storage.getMovieQuoteId = function(){
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if(!mqId){
// 		console.log("No movie quote id")
// 	}
// 	return mqId;
// }
// rhit.storage.setMovieQuoteId = function(movieQuoteId){
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY,movieQuoteId);
// }


rhit.LoginPageController = class {
	constructor() {
		console.log("You have made the Login Page Controller")
		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.FbAuthManager.signIn();
		};
	}
}
rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("You have made the auth Manager")
	}
	beginListening(changeListener) {

		firebase.auth().onAuthStateChanged((user) => {

			this._user = user;
			changeListener();

		});
	}


	signIn() {
		console.log("Signed in");
		// Please note this needs to be the result of a user interaction
		// (like a button click) otherwise it will get blocked as a popup
		Rosefire.signIn("cbfa3372-71d8-4eb8-a437-6504cb446e98", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				const errorcode = error.code;
				const errormessage = error.message;
				if (error.code === 'auth/invalid-custom-token') {
				  console.log("The token you provided is not valid.");
				} else {
				  console.error("signInWithCustomToken error",errorcode, errormessage);
				}
			  });
		});

	}


	signOut() {
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("You are now signed out");
		}).catch((error) => {
			// An error happened.
			console.log("sign out error");
		});

	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
}




/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.FbAuthManager = new rhit.FbAuthManager();
	rhit.FbAuthManager.beginListening((params) => {
		console.log("auth change callback fired")
	});

	if (document.querySelector("#listPage")) {

		console.log("You are on the List Page");
		rhit.FbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.Controller();

	}

	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail Page");

		// const movieQuoteId = rhit.storage.getMovieQuoteId();

		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");

		console.log(`Detail page for ${movieQuoteId}`)
		if (!movieQuoteId) {
			console.log("Error! Missing movie quote id!");
			window.location.href = "/";
		}

		rhit.FbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {

		console.log("You are on the Login Page");
		new rhit.LoginPageController();

	}



	//Temp code for Read and Add
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {

	// 	querySnapshot.forEach((doc) => {

	// 		console.log(doc.data());

	// 	});

	// });

	// ref.add({

	// 	quote: "My second test",
	// 	movie: "My second movie",
	// 	lastTouched: firebase.firestore.Timestamp.now()
	// });



};

rhit.main();