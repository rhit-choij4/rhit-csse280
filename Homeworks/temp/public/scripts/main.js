/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

rhit.counter = 0;

/** globals */
rhit.variableName = "";

/** function and class syntax examples */


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");


	$("#counterButtons button").click((event) => {

		console.log("buton", event.target);
		const dataAmount = $(event.target).data("amount");


		rhit.updateCounter(dataAmount)

	});

	$("#colorButtons button").click((event) => {

		console.log("buton", event.target);
		const dataColor = $(event.target).data("color");


		rhit.updateColor(dataColor)

	});




};

rhit.main();






rhit.updateCounter = function (amount) {
	/** function body */
	
	rhit.counter += amount;
	if(amount == 0){
		rhit.counter = 0; 
	}
	$("#counterText").html(`${rhit.counter}`);
};




rhit.updateColor = function (color) {
	const container = document.getElementById("favoriteColorBox");
	/** function body */
	container.style.backgroundColor= color;

	$("#favoriteColorBox").html(`${color}`);
	
	// $("#favoriteColorContainer").color("blue");
};