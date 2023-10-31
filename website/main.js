const sendMessage = document.querySelector('.clickable');

function send(){
    let a = document.querySelector(".write-message").value;
    console.log(a);
}

sendMessage.onclick = send;