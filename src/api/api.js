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

    try {
        const response = await fetch(host + url, options);

        if(response.ok != true){
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


export {
    get,
    post,
    put,
    del as delete,
}