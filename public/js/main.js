const socket = io('http://10.151.35.179:52346', {
    autoConnect: false
});

// Handle close event and refresh event
window.onbeforeunload = function () {
    socket.emit('logout', { username: localStorage.getItem('username') });
    localStorage.removeItem('username');
    socket.close();
}

// Chat handler function
function chatHandler(e) {
    e.preventDefault();

    const message = document.getElementById('message').value;
    document.getElementById('chat').innerHTML += `
    <div>
        <h4>${localStorage.getItem('username')}</h4>
        <p>${message}</p>
    </div>
    `;

    document.getElementById('message').value = '';

    socket.emit('message', {
        username: localStorage.getItem('username'),
        message: message
    });
}

// Login function
function loginHandler(e) {
    e.preventDefault();
    // Get username from login form
    const username = document.getElementById('input-username').value;
    localStorage.setItem('username', username);
    // Open a TCP socket
    socket.open();
}

// Handle login response
socket.on('login-response', data => {
    if (data.response) {
        document.getElementById('login-section').classList.replace('d-flex', 'd-none');
        document.getElementById('chat-section').style.display = 'inline-block';
    } else {
        // Handle login error
    }
});

socket.on('connect', () => {
    socket.emit('login', 
        { username: localStorage.getItem('username')}
    );
});

socket.on('server-message', data => {
    const msg = `
    <div>
        <h4>Server:</h4>
        <p>${data}</p>
    </div>
    `;
    document.getElementById("chat").innerHTML += msg;
});

socket.on('message', data => {
    const msg = `
    <div>
        <h4>${data.username}</h4>
        <p>${data.message}</p>
    </div>
    `;
    document.getElementById('chat').innerHTML += msg;
});