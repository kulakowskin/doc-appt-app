
const api_url = "http://localhost:8080";


function getUser(username, callback) {
    axios.get(api_url+"/"+encodeURIComponent(username))
        .then(res => {
            const user = res.data[0];
            console.log(user);
            callback(user);
        });
}

function createUser() {
    var username = document.getElementById("email").value;
    const user = {
        username: username,
        first: document.getElementById("first").value,
        last: document.getElementById("last").value,
        password: document.getElementById("password").value,
    };
    axios.post(api_url+"/"+encodeURIComponent(username), user)
        .then( res => {
            console.log(res.data);
            login();
            });
}

