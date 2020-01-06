//setup materialize components:
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var options = {
    inDuration: 250,
    outDuration: 250,
    // onCloseEnd:function(){
    //     alert('bạn đã đóng')
    // },
    // dismissible:true
  }
  //Modal:
  var instances = M.Modal.init(elems, options);
  //Collapse:
  var elem = document.querySelector('.collapsible');
  var instance = M.Collapsible.init(elem, {
    accordion: false // cái này tức là cho phép mở nhiều collapsible 1 lúc 
  });
});


var loggedInLinks = $('.logged-in');
var loggedOutLinks = $('.logged-out');
//UI khi người dùng đã đăng nhập:
function setupUILoggedIn() {
  loggedInLinks.css({
    "display": "block"
  });
  loggedOutLinks.css({
    "display": "none"
  })
}

//UI khi người dùng chưa đăng nhập:

function setupUILoggedOut() {
  loggedInLinks.css({
    "display": "none"
  });
  loggedOutLinks.css({
    "display": "block"
  })
}

function setupGuides() {
  db.collection('guides').onSnapshot(
    snapshot => {

      console.log(`snapshot.docs=`, snapshot.docs)

      document.querySelector('.guides').innerHTML = "";

      for (let doc of snapshot.docs) {
        const guide = doc.data();
        let li = `
            <li>
                <div class="collapsible-header grey lighten-4">${guide.title}</div>
                <div class="collapsible-body white">${guide.content}</div>    
            </li>
        `;
        document.querySelector('.guides').innerHTML += li;
      }




    }

    , err => console.log(err.message)

  )
}

function setupAccount(user) {
  if (user) {
    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
          const account_detail = `
          <div>${user.email}</div>
          <div>One line Bio: ${doc.data().bio}</div>
          `
          $('.account-details').html(account_detail)
          user.getIdTokenResult().then(IdTokenResult=>{
            if(IdTokenResult.claims.admin==true){
              $('.account-details').append("<p style='color:red'>ADMIN</p>")
            }
              
        })        

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
   }
  else {
    $('.account-details').html("")
  }


}

function showUIAdmin(){
  // $('.admin').css({"dislay":"block"})
  $('.admin').show()
}
function notShowUIAdmin(){
  // $('.admin').css({"display":"none"})
  $('.admin').hide()
}
