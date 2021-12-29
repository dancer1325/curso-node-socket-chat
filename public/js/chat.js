const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/'; // It would be changed when I deploy in my cluster exposed to internet

let usuario = null;
let socket  = null;

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');



// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || ''; // Get items stored in the LocalStorage

    if ( token.length <= 10 ) {
        window.location = 'index.html'; // Switch to index.html
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, { // Make HTTP request
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB ); // Update the localStorage's token with the renovated one
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
    
}

const conectarSocket = async() => { // When a new client connects to --> it will be executed
    
    socket = io({ // Initialize the client socket with extraheaders
        'extraHeaders': { // In the server side it will appear in the socket.handshake.headers
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{ // Listener to the "connect" event. Launched in case the socket client connects to the server
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{ // Launched in case the socket server is down
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes ); // Launched in case the socket server emit the event "recibir-mensaje"
    socket.on('usuarios-activos', dibujarUsuarios ); // Launched in case the socket server emit the event "usuarios-activos"

    socket.on('mensaje-privado', ( payload ) => { // Launched in case the socket server emit the event "mensaje-privado"
        console.log('Privado:', payload )
    });


}

const dibujarUsuarios = ( usuarios = []) => {

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml; // Insert into the ulUsuarios HTML element

}


const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML; // Insert into the ulMensajes HTML element

}


txtMensaje.addEventListener('keyup', ({ keyCode }) => { // Add event listener to the "txtMensaje" HTML element under action "keyup"
    
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if( keyCode !== 13 ){ return; } // KeyCode=13 === Press enter button
    if( mensaje.length === 0 ){ return; }

    socket.emit('enviar-mensaje', { mensaje, uid }); // Emit events

    txtMensaje.value = '';

})


btnSalir.addEventListener('click', ()=> { // Add event listener to the "btnSalir" HTML element under action "click"

    localStorage.removeItem('token'); // LocalStorage is the object to store the data with no expiration date

    const auth2 = gapi.auth2.getAuthInstance(); // Remove google authentication
    auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html'; // Switch to the index.html
    });
});


const main = async() => { //TODO: Why this main?
    // Validar JWT
    await validarJWT();
}

(()=>{
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();

// Not necessary to invoke manually
// main();

