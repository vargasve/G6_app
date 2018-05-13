function toggleSignIn() {
    if (!firebase.auth().currentUser) {

        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope("profile");
        provider.addScope("email");
        provider.addScope("https://www.googleapis.com/auth/plus.me");
        firebase.auth().signInWithPopup(provider); // Opens a popup window and returns a promise to handle errors.
       
        //firebase.auth().signInWithRedirect(provider);
    } else {
        firebase.auth().signOut();
    }
    document.getElementById("quickstart-sign-in").disabled = true;

}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
function initApp() {

    
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            document.getElementById('quickstart-account-details').textContent = token.displayName;
        } else {
            document.getElementById('quickstart-account-details').textContent = 'null';
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        var email = error.email;

        var credential = error.credential;

        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');

            
            console.error(error);
        }

    });


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid; // Use this key to store favorites
            var providerData = user.providerData;
            ($("#fav-check").addClass("loggedin");

            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as ' + displayName;
            $("#quickstart-sign-in").text('Sign out');
            $("#quickstart-sign-in").addClass('qs-sign-out');
            //var signinStuff = document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            //signinStuff.classList.add('qs-sign-out'); 
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            document.getElementById('quickstart-account-details').textContent = displayName;
            document.getElementById('quickstart-avatar').innerHTML = "<img src='" + photoURL + "'/>";


        } else {

            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
            document.getElementById('quickstart-account-details').textContent = '';
            document.getElementById('quickstart-oauthtoken').textContent = '';
            document.getElementById('quickstart-avatar').innerHTML = '';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}


window.onload = function () {
    initApp();
};










