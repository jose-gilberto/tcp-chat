const socket = io('http://localhost:52346', {
    autoConnect: false
});

// Handle close event and refresh event
window.onbeforeunload = function () {
    socket.emit('logout', { username: localStorage.getItem('username') });
    localStorage.removeItem('username');
    socket.close();
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
        document.getElementById('chat-section').style.display = 'flex';
    } else {
        // Handle login error
    }
});

socket.on('connect', () => {
    socket.emit('login', { username: localStorage.getItem('username')});
});