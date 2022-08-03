const API = `https://62ea586aad295463258a4036.mockapi.io`;
const heroesForm = document.querySelector(`#heroesForm`);
const comicsCategorySELECT = heroesForm.querySelector(`select`)

const controller = (url, method=`GET`, obj) => {
    let options = {
        method: method,
        headers: {
            "Content-type": "application/json"
        }
    }

    if(obj) options.body = JSON.stringify(obj);

    return fetch(url, options).then(response => response.ok ? response.json() : Promise.reject(response.status));
}







