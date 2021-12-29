// File to custom the events via WebSocket between the client and the server
const miFormulario = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/'; // It would be changed when I deploy in my cluster exposed to internet



miFormulario.addEventListener('submit', ev => { // Add event listener to the "form" HTML element under action "submit"
    ev.preventDefault(); // HTML element won't suffer the default action of the event.
    // In this case: 1) would send the information to the server, 2) would refresh the browser
    const formData = {};

    for( let el of miFormulario.elements ) { // Get the form's elements
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value // Add this array with key/name : value/value
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }

        localStorage.setItem('token', token); // Tokens are stored normally in the browser's localStorage
        window.location = 'chat.html'; //Switch to the other .html
    })
    .catch( err => {
        console.log(err)
    })
    
});


function onSignIn(googleUser) {

    // The next lines are just to display in console
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch( url + 'google', { // Make HTTP request
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        localStorage.setItem('token',token); // Tokens are stored normally in the browser's localStorage
        window.location = 'chat.html'; //Switch to the other .html
    })
    .catch( console.log );
    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}