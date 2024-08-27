import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.esm.js';

let q;
let fuse;

const options = {
    isCaseSensitive: false,
    includeScore: true,
    ignoreLocation: true,
    shouldSort: true,
    threshold: 0.9,
};

fetch('intents.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not good ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        q = collect(data);
        // console.log(q);
        fuse = new Fuse(q, options);
    })
    .catch(error => {
        console.error('Error with fetch operation:', error);
    });

function collect(data) {
    if (!data.intents) {
        console.error('Invalid data format:', data);
        return ["first"];
    }
    if (!Array.isArray(data.intents)) {
        console.error('Invalid data format:', data);
        return ["second"];
    }

    const patterns = [];  // Array to hold all patterns

    // Iterate over each intent in the intents array
    for (const intent of data.intents) {
        if (intent.patterns && Array.isArray(intent.patterns)) {
            patterns.push(...intent.patterns);  // Add patterns to the array
        }
    }

    return patterns.sort();  // Return the collected patterns
}

const resultsBox = document.querySelector(".results");
const inputBox = document.getElementById("input");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        const results = fuse.search(input);
        result = results.slice(0, 5).map(match => match.item);
        // console.log(result);
    }
    display(result);
    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}