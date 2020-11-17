let postRequest = (url, json, callback) => {

    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        },
        credentials: "include"
    };
    console.log(opts);
    return fetch(url,opts)
        .then(
            response => response.json());
};

let postRequestWithoutJson = (url, body, callback) => {

    let opts = {
        method: "POST",
        body: body,
        headers: {
            'token':localStorage.getItem('token')
        },
        credentials: "include"
    };

    return fetch(url,opts).then(response => response.json());
};

let putRequest = (url, json, callback) => {

    let opts = {
        method: "PUT",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        },
        credentials: "include"
    };

    return fetch(url,opts).then(response => response.json());
};

let getRequest = (url, parameterJson, callback) => {

    let urlPar = url;
    let keyLength = Object.keys(parameterJson).length;
    let opts = {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        },
    };
    if(keyLength !== 0) {
        urlPar += '?';
        let count = 0;
        for (let key in parameterJson) {
            urlPar += (key + '=');
            urlPar += parameterJson[key];
            count++;
            if (count < keyLength)
                urlPar += '&';
        }
    }
    console.log(opts);
    return fetch(urlPar,opts).then(response => response.json());
};

let deleteRequest = (url, json, callback) => {

    let opts = {
        method: "DELETE",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        },
        credentials: "include"
    };
    console.log(opts);

    return fetch(url,opts).then(response => response.json());

};

export {postRequest,
    postRequestWithoutJson,
    putRequest,getRequest,deleteRequest};