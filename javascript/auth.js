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
            $(".filter-icons.favs").show();

            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as ' + displayName;
            $("#quickstart-sign-in").text('Sign out');
            $("#quickstart-sign-in").addClass('qs-sign-out');
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            document.getElementById('quickstart-account-details').textContent = displayName;
            document.getElementById('quickstart-avatar').innerHTML = "<img src='" + photoURL + "'/>";

            window.userUID = uid;

            var database = firebase.database();

            database.ref('/happyHowlerData/users').child(uid).child('favorites').on('child_added', function (childSnapshot) {
                window.userFavorites[childSnapshot.key] = true;
                $('[data-fav="' + childSnapshot.key + '"]').addClass('favorited');
            });
            database.ref('/happyHowlerData/users').child(uid).child('favorites').on('child_removed', function (childSnapshot) {
                window.userFavorites[childSnapshot.key] = false;
                $('[data-fav="' + childSnapshot.key + '"]').removeClass('favorited');
            });

        } else {
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
            document.getElementById('quickstart-account-details').textContent = '';
            document.getElementById('quickstart-oauthtoken').textContent = '';
            document.getElementById('quickstart-avatar').innerHTML = '';
            $(".filter-icons.favs").hide(); // this is to hide the Favorites icon

            if (window.userUID) {
                var database = firebase.database();

                database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').off('child_added');
                database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').off('child_removed');
                $('.favorites-button').removeClass('favorited');
                $('.favorites-button').hide();
            }

            window.userUID = null;
            window.userFavorites = {};
        }

        document.getElementById('quickstart-sign-in').disabled = false;

    });

    
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}


window.onload = function () {
    // Turn on or off for testing purposes
    var LOCAL_TESTING_MODE = false;

    if (LOCAL_TESTING_MODE) {
        $(".filter-icons.favs").show();

        window.userUID = 'foo';
        window.userFavorites = {};

        var database = firebase.database();

        database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').on('child_added', function (childSnapshot) {
            window.userFavorites[childSnapshot.key] = true;
            $('[data-fav="' + childSnapshot.key + '"]').addClass('favorited');
        });
        database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').on('child_removed', function (childSnapshot) {
            window.userFavorites[childSnapshot.key] = false;
            $('[data-fav="' + childSnapshot.key + '"]').removeClass('favorited');
        });
    } else {
        window.userUID = null;
        window.userFavorites = {};

        initApp();
    }
};










