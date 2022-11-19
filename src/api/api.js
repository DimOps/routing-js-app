import { clearUserData, getUserData, setUserData } from "./utils";

host = 'http://localhost:3030'

async function request(method, url, data){
    const options = {
        method,
        headers: {}
    };

    if(data != undefined){
        options.headers['Cotent-type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = getUserData(data);

    if (user) {
        const token = user.accessToken;
        options.headers['X-Authorization'] = token;
    }



    try {
        const response = await fetch(host + url, options);

        if(response.ok != true){
            if(response.status == 403){  // invalid session
                clearUserData();
            }
            const error = await response.json();
            throw new Error(error.message);
        }

        if(response.status == 204){
            return response; // empty response parsed to json returns error
        } else {
                return response.json();
        }

    } catch (err) {
        alert(err.message);
        throw(err);
    }
}

const get = request.bind(null, 'get');
const post = request.bind(null, 'post');
const put = request.bind(null, 'put');
const del = request.bind(null, 'delete');

async function login(email, password) {
    const result = await post('users/login', { email, password });

    const userData = {
        email: result.email,
        id: result._id,
        token: result.accessToken
    };
    setUserData(userData);
}

async function register(email, password) {
    const result = await post('users/register', { email, password });

    const userData = {
        email: result.email,
        id: result._id,
        token: result.accessToken
    };
    setUserData(userData);
}

async function logout(){
    await get('users/logout');
    clearUserData();
}

export {
    get,
    post,
    put,
    del as delete,
    login,
    register,
    logout,
}