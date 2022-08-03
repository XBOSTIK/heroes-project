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


heroesForm.addEventListener(`submit`, e=>{
    e.preventDefault();

    let name = e.target.querySelector(`input[data-name="heroName"]`).value,
        category = e.target.querySelector(`select[data-name="heroComics"]`).value,
        favourite = e.target.querySelector(`input[data-name="heroFavourite"]`).checked;
    //console.log(nameSurname,comics, favourite)

    let newComicOBJ = {
        name: name,
        comics: category,
        favourite: favourite
    };

    controller(API + `/hero`)
    .then(heroes => {
        let heroesName = [] 
        heroes.map(item => heroesName.push(item.name))
        if(heroesName.includes(newComicOBJ.name)){
            alert(`${newComicOBJ.name} alredy exist`)
        } else {
            controller(API + `/hero`, `POST`, newComicOBJ)
            .then(data => renderTableRow(data))
            .catch(err => console.log(`In catch: ${err}`))
            
        }
    })
    .catch(err => console.log(`In catch: ${err}`));

})


const renderCategories = () => {
    controller(API + `/universes`)
    .then(categories =>  categories.forEach(cat => appendCategory(cat)))
    .catch(err => console.log(`In catch: ${err}`));
}
renderCategories()

const appendCategory = category => {
    let option = document.createElement(`option`);
    option.innerHTML = category.name;
    option.value = category.name;
    comicsCategorySELECT.append(option);
}


const renderTable = () => {
    controller(API + `/hero`)
    .then(heroes => heroes.forEach(hero => renderTableRow(hero)))
    .catch(err => console.log(`In catch: ${err}`));
}

renderTable();

const table = document.querySelector(`#heroesTable`);
const tableTbody = table.querySelector(`tbody`);

const renderTableRow = (hero) => {

    //console.log(hero)
    let tableTR = document.createElement(`tr`)
    tableTR.dataset.id = hero.id;
    let rowINNER = `
  
        <td>${hero.name}</td>
        <td>${hero.comics}</td>
        <td>
            <label class="heroFavouriteInput">
                Favourite: <input type="checkbox" data-id="${hero.id}"></label>    
            </label>
        </td>
        <td>
        <button data-id="${hero.id}">Delete</button>
        </td>

    `
    tableTR.innerHTML = rowINNER;
    tableTbody.append(tableTR);
    
    let checkFav = table.querySelector(`input[data-id="${hero.id}"]`)
    checkFav.checked = hero.favourite;

    checkFav.addEventListener(`change`, () => {
        controller(API+`/hero/${hero.id}`, `PUT`, {favourite: checkFav.checked});
    })

    let deleteButton = table.querySelector(`button[data-id="${hero.id}"]`)

    deleteButton.addEventListener(`click`, () => {
        controller(API+`/hero/${hero.id}`, `DELETE`)
        .then(() => tableTR.remove())
        .catch(err => console.log(`In catch: ${err}`));
    })


}






