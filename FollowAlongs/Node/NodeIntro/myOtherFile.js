
let name = "Jinyoung Choi";
let counter = 0; 
inc = () => {
    counter++;
};
dec = () => {
    counter--;
};
getCounter = () => {return counter};

module.exports ={
    name,
    inc,
    dec,
    getCounter
}