
const api_url = "https://dr-appointment-app.herokuapp.com/api/";


function getUser(username, callback) {
    axios.get(api_url+"users/"+encodeURIComponent(username))
        .then(res => {
            const user = res.data;
            console.log(res.data);
            callback(user);
        });
}

function getAllProviders(callback){
    axios.get(api_url+"users/providers")
        .then(res => {
            const providers = res.data;
            console.log(providers);
            callback(providers);
        });
}

function createUser() {
    var username = document.getElementById("email").value;
    const user = {
        username: username,
        first: document.getElementById("first").value,
        last: document.getElementById("last").value,
        password: document.getElementById("password").value,
        provider: document.getElementById("provider").value
    };
    axios.post(api_url+"users/", user)
        .then( res => {
            console.log(res.data);
            login();
            });
}

