const resultsBox = document.querySelector(".results");
const inputBox = document.getElementById("input");

const counter = document.querySelector(".counter");
const maxLength = input.getAttribute('maxlength');

inputBox.addEventListener('input', () => {
    const currentLength = inputBox.value.length;
    counter.textContent = `${currentLength} / ${maxLength}`;
});

let clear = document.querySelector('.clear');

clear.addEventListener('click', () => {
    inputBox.value = '';
    const currentLength = inputBox.value.length;
    counter.textContent = `${currentLength} / ${maxLength}`;
    if(!inputBox.length){
        resultsBox.innerHTML = '';
    }
})

function selectInput(list){
    inputBox.value = list.innerHTML;
    const currentLength = inputBox.value.length;
    counter.textContent = `${currentLength} / ${maxLength}`;
}

let enter = document.querySelector('.enter');