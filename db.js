
const api_url = "http://localhost:8080";


function getUser(username, callback) {
    axios.get(api_url+"/"+encodeURIComponent(username))
        .then(res => {
            const user = res.data[0];
            console.log(user);
            callback(user);
        });
}

