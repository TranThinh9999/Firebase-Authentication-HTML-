//let db=firebase.firestore()
$('document').ready(function () {
    //add amin cloud function:
    const adminForm = document.querySelector('.admin-actions');
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const adminEmail = document.querySelector('#admin-email').value;
        const addAdminRole = functions.httpsCallable('addAdminRole');
        addAdminRole({ email: adminEmail }).then(result => {
            console.log(result)
        });

    })

    // const guidesArr = [];
    //Kiểm tra State ng dùng:
    auth.onAuthStateChanged(function (user) {
        //logged in:
        if (user) {
            //kiểm tra xem user này có phải là admin hay k
            user.getIdTokenResult().then(IdTokenResult=>{
                if(IdTokenResult.claims.admin==true){
                    showUIAdmin();
                
                }
                else{
                    //do not show UIADMIN()
                    notShowUIAdmin();
                }       
            })        
            setupGuides();
            setupUILoggedIn();
            setupAccount(user);
            //logged out:
        } else {
            notShowUIAdmin();
            document.querySelector('.guides').innerHTML = "hay dang nhap de xem guides"
            setupUILoggedOut();

            setupAccount();

        }
    })

    //SIGN UP:
    const signupForm = document.querySelector('#signup-form');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let email = document.querySelector('#signup-email').value;
        let password = document.querySelector('#signup-password').value;
        console.log(email, password)
        //Đăng ký user:
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            return db.collection('users').doc(cred.user.uid).set({
                bio: document.querySelector('#signup-bio').value
            })
        }).then(() => {
            let modal = document.querySelector('#modal-signup')
            M.Modal.getInstance(modal).close();
            signupForm.reset();
        }).catch(err=>{
            signupForm.querySelector('.error').innerHTML=err.message
        })
    })

    //Log out:
    const logout = document.querySelector('#logout');
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            alert('ban da dang xuat')

        })
    });

    //signIn:

    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let email = document.querySelector('#login-email').value;
        let password = document.querySelector('#login-password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
            console.log(`sau khi login cred=`, cred.user);
            let modal = document.querySelector('#modal-login')
            M.Modal.getInstance(modal).close();
            loginForm.reset();
        }).catch(err=>{
            loginForm.querySelector('.error').innerHTML = err.message;
        })
    });


    //CREATE GUIDE:
    const createForm = document.querySelector('#create-form');
    createForm.addEventListener('submit', function (e) {
        e.preventDefault();
        db.collection('guides').add({
            title: document.querySelector('#title').value,
            content: document.querySelector('#content').value,
        }).then(() => {
            const modal = document.querySelector('#modal-create');
            M.Modal.getInstance(modal).close();
            createForm.reset();
        }).catch(err => {
            console.log(err.message);

        })
    })
})











