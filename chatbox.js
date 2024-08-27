class Chatbox {
    constructor() {
        this.args = {
            chatbox: document.querySelector('.chatbox'),
        }
        
        this.messages = [];
    }

    display() {
        const {chatbox} = this.args;
        const button = document.querySelector(".enter");

        button.addEventListener('click', () => this.onButton(chatbox))

        const node = document.getElementById("input");
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onButton(chatbox)
            }
        })
    }

    onButton(chatbox) {
        var inputBox = document.getElementById("input");
        let text1 = inputBox.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            inputBox.value = '';
            const counter = document.querySelector(".counter");
            const maxLength = input.getAttribute('maxlength');
            const currentLength = inputBox.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            const resultsBox = document.querySelector(".results");
            if(!inputBox.length){
                resultsBox.innerHTML = '';
            }
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            inputBox.value = '';
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messagesItem messagesVisitor">' + item.message + '</div>';
            }
            else
            {
                html += '<div class="messagesItem messagesOperator">' + item.message + '</div>';
            }
          });

        const chatmessage = chatbox.querySelector('.messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();