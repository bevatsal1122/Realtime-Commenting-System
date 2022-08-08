let person = null; 

const postButton = document.querySelector('.post-button');
const commentBox = document.querySelector('.comment-box');
const commentsSection = document.querySelector('.comments');
const liveTyping = document.querySelector('.live-typing');
const socket = io();

do {
    person = prompt("Enter your Name");
} while (person === null || person === '')

function fetchDatabase() {
    fetch('/api/getAllComments', {
        method: 'Get'
    })
    .then(res => res.json())
    .then(result => {
        result.forEach((comment) => {
            appendToDOM(comment);
        })
    })
}

window.onload = fetchDatabase;

postButton.addEventListener('click', () => {
    let comment = commentBox.value;
    if (!comment) {
       return alert("Cannot Post Empty Comments"); 
    }
    postComment(comment);
});

function postComment(comment) {
    const data = {
        username: person,
        comment,
        date: moment(new Date(Date.now())).format('LL [-] hh:mm A')
    }
    appendToDOM(data);
    broadcastComment(data);
    syncDatabase(data);
}

function appendToDOM(data) {
    let newliTag = document.createElement('li');
    newliTag.classList.add('oneComment');
    let markup = `<div class="card mb-4 p-2 pt-3 col-6">
    <strong><span class="commentor text-white">${data.username}</span>
    <p class="text-success mt-2">${data.comment}</p>
    <small>🕛 ${data.date}</small></strong>
    </div></li>`
    newliTag.innerHTML = markup;
    commentsSection.prepend(newliTag);
    commentBox.value = '';
}

function broadcastComment(data) {
    socket.emit('comment', data);
}

function syncDatabase(data) {
    fetch('/api/uploadComment', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {});
}

commentBox.addEventListener('keyup', () => {
    socket.emit('typing', { person });
})

socket.on('comment', (data) => {
    appendToDOM(data);
})

let timerID = null;
function debounce(callback, timer) {
    if(timerID) {
        clearTimeout(timerID);
    }
    timerID = setTimeout(() => {
        callback();
    }, timer);
}

socket.on('typing', (data) => {
    liveTyping.innerText = `${data.person} is typing...`
    debounce(() => {
        liveTyping.innerText = ``
    }, 1400);
})

