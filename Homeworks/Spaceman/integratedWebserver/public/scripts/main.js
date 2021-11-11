var rhit = rhit || {};
const adminApiUrl = "http://localhost:3000/api/admin/";
//Reference (Note: the Admin api tells you words.  You are an admin.):
// POST   /api/admin/add      with body {"word": "..."} - Add a word to the word list
// GET    /api/admin/words    													- Get all words
// GET    /api/admin/word/:id 													- Get a single word at index
// PUT    /api/admin/word/:id with body {"word": "..."} - Update a word at index
// DELETE /api/admin/word/:id 													- Delete a word at index

const playerApiUrl = "http://localhost:3000/api/player/";
//Reference (The player api never shares the word. It is a secret.):
// GET    /api/player/numwords    											- Get the number of words
// GET    /api/player/wordlength/:id								 		- Get the length of a single word at index
// GET    /api/player/guess/:id/:letter								  - Guess a letter in a word




rhit.AdminController = class {
	constructor() {
		// Note to students, the contructor is done.  You will be implementing the methods one at a time.
		// Connect the buttons to their corresponding methods.
		document.querySelector("#addButton").onclick = (event) => {
			const createWordInput = document.querySelector("#createWordInput");
			this.add(createWordInput.value);
			createWordInput.value = "";
		};
		document.querySelector("#readAllButton").onclick = (event) => {
			this.readAll();
		};
		document.querySelector("#readSingleButton").onclick = (event) => {
			const readIndexInput = document.querySelector("#readIndexInput");
			this.readSingle(parseInt(readIndexInput.value));
			readIndexInput.value = "";
		};
		document.querySelector("#updateButton").onclick = (event) => {
			const updateIndexInput = document.querySelector("#updateIndexInput");
			const updateWordInput = document.querySelector("#updateWordInput");
			this.update(parseInt(updateIndexInput.value), updateWordInput.value);
			updateIndexInput.value = "";
			updateWordInput.value = "";
		};
		document.querySelector("#deleteButton").onclick = (event) => {
			const deleteIndexInput = document.querySelector("#deleteIndexInput");
			this.delete(parseInt(deleteIndexInput.value));
			deleteIndexInput.value = "";
		};
	}

	add(word) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}

		// TODO: Add your code here.

		let entry = fetch(adminApiUrl + "add", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify({
					word: word
				})
			})
			.then(response => response.json())
			.then(data => {});



	}

	readAll() {
		// TODO: Add your code here.

		let entry = fetch(adminApiUrl + "words")
			.then(response => response.json())
			.then(data => {
				document.querySelector("#readAllOutput").innerHTML = data.words;

			});
		// Hint for something you will need later in the process (after backend call(s))
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		// TODO: Add your code here.
		let entry = fetch(adminApiUrl + "word/" + index)
			.then(response => response.json())
			.then(data => {
				document.querySelector("#readSingleOutput").innerHTML = data.word;

			});
	}

	update(index, word) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		// TODO: Add your code here.
		let entry = fetch(adminApiUrl + "word/" + index, {
				method: "PUT",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify({
					word: word,
					index: index
				})
			})
			.then(response => response.json())
			.then(data => {});
	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		// TODO: Add your code here.

		let entry = fetch(adminApiUrl + "word/" + index, {
				method: "DELETE",

			})
			.then(response => response.json())
			.then(data => {});

	}






}

rhit.PlayerController = class {
	constructor() {
		// Note to students, you can declare instance variables here (or later) to track the state for the game in progress.
		// Connect the Keyboard inputs
		this.currentWordIndex = -1;
		this.currentWord = "";
		this.wrongList = [];


		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.onclick = (event) => {
				this.handleKeyPress(keyboardKey.dataset.key);
			};
		}
		// Connect the new game button
		document.querySelector("#newGameButton").onclick = (event) => {

			this.handleNewGame();

		}
		this.handleNewGame(); // Start with a new game.

	}

	guess(keyvalue) {
		let entry = fetch(playerApiUrl + "guess/" + this.currentWordIndex + "/" + keyvalue.toLowerCase())
			.then(response => response.json())
			.then(data => {
				if (data.locations = true) {
					let addWrong = true;
					for (let i = 0; i < this.wrongList.length; i++) {
						if (this.wrongList[i] == keyvalue) {
							addWrong = false;
						}
					}
					if (addWrong) {
						this.wrongList.push(keyvalue);
					} else {
						for (let i = 0; i < data.locations.length; i++) {
							this.currentWord = this.currentWord.substr(0, data.locations[i]) + keyvalue + this.currentWord.substr(data.locations[i] + 1);
						}
					}
					this.updateView();
				}
			});
	}






	handleNewGame() {


        this.currentWord = "";
        this.incorrectList = [];

        fetch(playerApiUrl + "numwords")
            .then(response => response.json())
            .then(data => {
                this.currentWordIndex = Math.floor(Math.random() * data.length);
                console.log(this.currentWordIndex);
                fetch(playerApiUrl + "wordlength/" + this.currentWordIndex)
                    .then(response => response.json())
                    .then(data => {
                        for(let i = 0; i < data.length; i++) {
                            this.currentWord += "_";
                        }
                        console.log(this.currentWord);
                        this.updateView();
                    })
            })

        // TODO: Add your code here.

    }

	handleKeyPress(keyValue) {
        console.log(`You pressed the ${keyValue} key`);

        fetch(playerApiUrl + "guess/" + this.currentWordIndex + "/" + keyValue.toLowerCase())
            .then(response => response.json())
            .then(data => {
                if(data.locations.length == 0) {
                    
                    let addToIncorrect = true;
                    for(let i = 0; i < this.incorrectList.length; i++) {
                        if(this.incorrectList[i] == keyValue) {
                            addToIncorrect = false;
                        }
                    }

                    if(addToIncorrect) {
                        this.incorrectList.push(keyValue);
                    }

                } else {
                    
                    console.log(data.locations)

                    for(let i = 0; i < data.locations.length; i++) {
                        this.currentWord = this.currentWord.substr(0, data.locations[i]) + keyValue + this.currentWord.substr(data.locations[i] + 1);
                    }

                    console.log(this.currentWord);

                }

                this.updateView();
            })


        // TODO: Add your code here.

    }

    updateView() {
        console.log(`TODO: Update the view.`);
        // TODO: Add your code here.


        // Some hints to help you with updateView.
        document.querySelector("#displayWord").innerHTML = this.currentWord;

        document.querySelector("#incorrectLetters").innerHTML = this.incorrectList.toString();

        const keyboardKeys = document.querySelectorAll(".key");
        for (const keyboardKey of keyboardKeys) {
            if (this.incorrectList.includes(keyboardKey.dataset.key)) {
                keyboardKey.style.visibility = "hidden";
            } else {
                keyboardKey.style.visibility = "initial";
            }
        }
    }
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#adminPage")) {
		console.log("On the admin page");
		new rhit.AdminController();
	}
	if (document.querySelector("#playerPage")) {
		console.log("On the player page");
		new rhit.PlayerController();
	}
};

rhit.main();