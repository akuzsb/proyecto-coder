
console.log('Hello from chat.js!')

const socket = io();

socket.on('messages', (data) => {
    console.log(data);
    listadoChat.innerHTML = data.map((message) => `<div>
        <strong>${message.user}</strong>:
        <span>${message.message}</span>
    </div>`).join(' ');
    scrollToBottom();

});

function scrollToBottom() {
    listadoChat.scrollTop = listadoChat.scrollHeight;
}

const listadoChat = document.getElementById('chat-messages');
const formMensaje = document.getElementById('message-form');

formMensaje.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('message-input').value;
    const usuario = document.getElementById('username').value;
    socket.emit('new-message', { user: usuario, message: mensaje });

    mensaje.value = '';
});

const guardarUsuario = document.getElementById('username');
guardarUsuario.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
});

if (localStorage.getItem('username')) {
    guardarUsuario.value = localStorage.getItem('username');
}