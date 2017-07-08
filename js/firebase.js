var config = {
    apiKey: "AIzaSyAdgycqP7HbVBRs29kRL5pRFHHzZ9_CHTw",
    authDomain: "beer-me-863c9.firebaseapp.com",
    databaseURL: "https://beer-me-863c9.firebaseio.com",
    projectId: "beer-me-863c9",
    storageBucket: "beer-me-863c9.appspot.com",
    messagingSenderId: "71623818381"
  };
    firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();

    var auth = firebase.auth();

    var userId;
    var reviewData = {};
   
   $(document).on("click", "#add-brewery-btn", function(event) {
    // console.log("test", userId);

          if (!userId) {
        $("#review-error").html("Please sign in first")
        return
      }


            event.preventDefault();

            reviewData.name = $("#brewery-name-input").val().trim();
            reviewData.date = $("#date-input").val().trim();
            reviewData.comment = $("#comments-input").val().trim();
            reviewData.style = $("#beer-style-input").val().trim();
            reviewData.beer = $("#beer-input").val().trim();
            
            database.ref("users/" + userId).push(reviewData);
      });

// database.ref("users/" + userId).on("child_added", function(childSnapshot) {
//       // Log everything that's coming out of snapshot
//       // console.log(childSnapshot.val().name);
//       // console.log(childSnapshot.val().comment);
//       // console.log(childSnapshot.val().date);

//       var reviewData = childSnapshot.val();

//       // full list of items to the well
//         $("#brewery-table > tbody").append("<tr><td>" + reviewData.date + "</td><td>" + reviewData.name + "</td><td>" + reviewData.beer +"</td><td>" + reviewData.style + "</td><td>" +
//           reviewData.comment + "</td></tr>");

//       // empty form after submit
//       $("#brewery-name-input").val("");
//       $("#date-input").val("");
//       $("#comments-input").val("");
//       $("#beer-input").val("");
//       $("#beer-style-input").val("");

//     // Handle the errors
//     }, function(errorObject) {
//       console.log("Errors handled: " + errorObject.code);
//       $("#review-error").html(errorObject.code);
//     });

//AUTHENTICATION
//sign in
$(document).on("click", "#login", function(event) {
  event.preventDefault();

   var email = $("#email").val();
   var password = $("#password").val();

   if (!email || !password) {
     $("#error").html("Email and Password Required");
      return console.log("Email and Password Required");
      }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (user) {
      userId = user.uid;
    // location.href = './index.html';
      console.log("signed in");
      $("#error").html("Success! You're logged in as " + email)

    stateChange();
    addData();

    $("#show-user").html(email);
    $("#email").val("");
    $("#password").val("");
  });
});

//Register
// $("#register").on("click", function(event){
$(document).on("click", "#register", function(event) {
     event.preventDefault();
   
    var email = $("#email").val();
    var password = $("#password").val();
    console.log(email, password);

    auth.createUserWithEmailAndPassword(email, password)
   .then(function (user) {
      userId = user.uid; 
       var ref = database.ref("users/" + user.uid);
       var newUser = {
          email:user.email,
          id: user.uid
          }
        ref.set(newUser);

     stateChange();
     addData();

     $("#error").html("Success! You're registered as " + email)
     
     // location.href = './index.html';
   })
   .catch(function(error) {
      console.log("register error" + error);
      $("#error").html(error.message);
    });
      $("#show-user").html(email);
      $("#email").val("");
      $("#password").val("");
});

//Sign Out
$(document).on("click", "#logout", function(event) {
    auth.signOut();
});

//auth state change
function stateChange() {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      var ref = database.ref('users/' + user.uid);
      ref.on('child_added', function (snap) {
        // console.log(snap.val());
      });
    } else{
      console.log("No user signed in");
    }
  });
};

function addData() {
    database.ref("users/" + userId).on("child_added", function(childSnapshot) {

      var reviewData = childSnapshot.val();

      if (typeof reviewData === "object") {
        // full list of items to the well
        $("#brewery-table > tbody").append("<tr><td>" + reviewData.date + "</td><td>" + reviewData.name + "</td><td>" + reviewData.beer +"</td><td>" + reviewData.style + "</td><td>" +
          reviewData.comment + "</td></tr>");

         // empty form after submit
        $("#brewery-name-input").val("");
        $("#date-input").val("");
        $("#comments-input").val("");
        $("#beer-input").val("");
        $("#beer-style-input").val("");
      }

    // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
        $("#review-error").html(errorObject.code);
        });
    };




// At users/
// {
//   email: "tony@gmail.com",
//   beers: [
//     {
//       beer: "big beer"
//       comment: "good beer"
//       date: "6/5/17"
//       name: "wynkoop"
//       style: "Belgian"
//     }
//   ]
// }




//LINK USER DATA WITH CURRENT USER
//Get the firebase reference    
// var isNewUser = true;

// var ref = new Firebase("https://beer-me-863c9.firebaseio.com");
//     ref.onAuth(function(authData) {
//       if (authData && isNewUser) {
//         // save the user's profile into Firebase so we can list users,
//         // use them in Security and Firebase Rules, and show profiles
//         ref.child("users").child(authData.uid).set({
//           provider: authData.provider,
//           name: getName(authData)
//           //some more user data
//             });
//           }
//         });
// //Get the correct firebase reference
// var ref = new Firebase("https://beer-me-863c9.firebaseio.com").child("users").child(authData.uid);
// //Get the data
// ref.once("value", function(data) {
//   // do some stuff once, user data will be in the variable data
// });