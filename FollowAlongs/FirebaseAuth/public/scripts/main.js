
var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
		  var displayName = user.displayName;
		  var email = user.email;
		  var phoneNumber = user.phoneNumber;
		  var photoURL = user.photoURL;
		  var isAnonymous = user.isAnonymous;
		  var uid = user.uid;
		  var providerData = user.providerData;
		  // ...
		  console.log("The user is signd in " , uid);
		  console.log('displayName :>> ', displayName);
		  console.log('email :>> ', email);
		  console.log('photoURL :>> ', photoURL);
		  console.log('phoneNumber :>> ', phoneNumber);
		  console.log('isAnonymous :>> ', isAnonymous);
		  console.log('uid :>> ', uid);
		} else {
		  // User is signed out
		  // ...
		  console.log("There is no user signed in");
		}
	  });

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		console.log(`sign out`);
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("You are now signed out");
		  }).catch((error) => {
			// An error happened.
			console.log("sign out error");
		  });

	}
	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`Create account for Email: ${inputEmailEl.value} Password: ${inputPasswordEl.value}`)
		
		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
		.then((userCredential) => {
		  // Signed in 
		  var user = userCredential.user;
		  // ...
		})
		.catch((error) => {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log("Create Account error", errorCode, errorMessage);
		  // ..
		});



	}
	document.querySelector("#logInButton").onclick = (event) => {
		console.log(`Log in for Email: ${inputEmailEl.value} Password: ${inputPasswordEl.value}`)
		
		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
		.then((userCredential) => {
		  // Signed in
		  var user = userCredential.user;
		  // ...
		})
		.catch((error) => {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log("Create Account error", errorCode, errorMessage);
		});
	}

	document.querySelector("#anonymousAuthButton").onclick = (event) => {
		firebase.auth().signInAnonymously()
		.then(() => {
		  // Signed in..
		})
		.catch((error) => {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log("AnonymousAuth error", errorCode, errorMessage);

		  // ...
		});

		
	}
	rhit.startFirebaseUI();


};
rhit.startFirebaseUI = function(){

	// FirebaseUI config.
	var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
}
rhit.main();
