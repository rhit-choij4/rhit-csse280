var counter = 0; 



function main(){
    document.querySelector("#dec").onclick = (event) =>{
        counter = counter -1;
        updateView();
    }
    document.querySelector("#inc").onclick = (event) =>{
        counter = counter +1;
        updateView();
    }
    document.querySelector("#reset").onclick = (event) =>{
        counter = 0;
        updateView();
    }
}

function updateView(){
    document.querySelector("#counter").innerHTML = `Count = ${counter}`;
}



main();