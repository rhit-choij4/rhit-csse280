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
	// let buttons = document.querySelectorAll("#counterButtons button");

	// for(const button of buttons){

	// 	button.onclick = (event) => {
	// 		const dataAmount = parseInt(button.dataset.amount);
	// 		const dataIsMultiplication = button.dataset.isMultiplication == "true";

	// 		console.log(`Amount: ${dataAmount} isMult: ${dataIsMultiplication}`);
	// 		console.log(`Amount: ${typeof(dataAmount)} isMult: ${typeof(dataIsMultiplication)}`);

			
	// 		rhit.updateCounter(dataAmount,dataIsMultiplication);

	// }

	// };

	$("#counterButtons button").click((event) => {

		console.log("buton", event.target);
		const dataAmount = $(event.target).data("amount");
		const dataIsMultiplication = !!$(event.target).data("isMultiplication");
		// console.log(`Amount: ${dataAmount} isMult: ${dataIsMultiplication}`);
		// console.log(`Amount: ${typeof(dataAmount)} isMul	t: ${typeof(dataIsMultiplication)}`);

		rhit.updateCounter(dataAmount,dataIsMultiplication);

	});






};

rhit.main();






rhit.updateCounter = function (amount, isMultiplication) {
	/** function body */
	if(isMultiplication){

		rhit.counter *= amount;
	}else{
		rhit.counter += amount;
	}
	// document.querySelector("#counterText").innerHTML = `Count = ${rhit.counter}`;
	$("#counterText").html(`Count = ${rhit.counter}`);
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}