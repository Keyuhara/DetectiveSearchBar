import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.esm.js';

let q;
let fuse;
let m;
let muse;

const options = {
    isCaseSensitive: false,
    includeScore: true,
    ignoreLocation: true,
    shouldSort: true,
    threshold: 0.3,
    keys: ["pattern"]
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

        m = map(data);
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

// Create a map storing patterns/questions and responses/answers
function map(data) {
    if (!data.intents) {
        console.error('Invalid data format:', data);
        return new Map();
    }
    if (!Array.isArray(data.intents)) {
        console.error('Invalid data format:', data);
        return new Map();
    }

    // Create a data structure to store intents
    const dataMap = new Map();
    
    // Populate the dataMap with patterns and responses
    data.intents.forEach(intent => {
        dataMap.set(intent.tag, {
            patterns: intent.patterns,
            responses: intent.responses
        });
    });

    return new Map([...dataMap.entries()].sort());
}

// Search for best matched question and return associated response randomly
export default function getServerlessResponse(userInput) {
    let bestMatch = null;
    let bestScore = Infinity;
  
    // Iterate through each intent in the datamap
    for (const [intent, data] of m.entries()) {
        const { patterns, responses } = data;
  
        // Prepare the patterns for Fuse.js
        muse = new Fuse(patterns.map(pattern => ({ pattern })), options);
    
        // Fuse.js search
        const result = muse.search(userInput);
  
        if (result.length > 0 && result[0].score < bestScore) {
            bestScore = result[0].score;
            bestMatch = {
                intent,
                response: responses[Math.floor(Math.random() * responses.length)]
            };
        }
    }
  
    return bestMatch ? bestMatch.response : "Sorry, I do not understand...";
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