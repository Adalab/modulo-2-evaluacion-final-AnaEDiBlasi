'use strict'

/* 
pasos a seguir
1.obtener elementos del HTML/ 
2.escuchar el evento de busqueda(click en el boton de buscar)
3.Buscar las serie de anime (funcion)
4.mostrar los resultados d la busqueda (funcion)
5.funcion para agregar o quitar favoritos
6.gestionar los favoritos


*/

//Seleccion de elementos del HTML con sus respectivas clases 

const searchInput = document.querySelector('.js_search-input')
const searchButton = document.querySelector('.js_search-button')
const resultsList = document.querySelector('.js_results-list')
const favoritesList = document.querySelector('.js_favorites-list')
const resetButton = document.querySelector('.js_reset-button')

//array para almacenar favoritos
let favorites = [];


//cargar favoritos en localstorage al iniciar
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites); // Recuperamos los favoritos desde localStorage
        renderFavorites(); // Renderizamos los favoritos al cargar la página
    }
}



//1.evento de busqueda en el boton buscar, añadimos la funcion searchAnime que obtiene el valor del input de busqueda y hace una solicitud a la api
searchButton.addEventListener('click', (event) =>{
    event.preventDefault()
    console.log('boton presionado')
    searchAnime()

})


//evento de reset en el boton 

resetButton.addEventListener('click', (event) =>{
    event.preventDefault()
    resetPage()
    

})

//2.funcion buscar serie de anime 
//obtiene el valor del input de busqueda y hace una solicitud a la api

function searchAnime(){
    const inputValue = searchInput.value.trim()
    // Obtenemos el valor del input directamente
    //.trim() es un método de los strings (cadenas de texto) que elimina los espacios en blanco al principio y al final de la cadena
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/trim

    if (inputValue){
        fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
        .then(answer => answer.json())//convertimos la respuesta en json
        .then(data => renderResults(data.data))//llamamos a renderResults con los datos obtenidos
        .catch(error => console.error('error al buscar anime', error))
    }//hacemos un if, si la busqueda tiene exito los resultados pasan a esta funcion
 //renderResults()
}


//mostrar resultados de la busqueda
//esta funcion la meteremos en la funcion SearchAnime para que al llamar a search anime nos pinte los resultados de la busqueda

function renderResults(animeList) {
    resultsList.innerHTML = ''; // Limpiamos los resultados previos
    animeList.forEach((anime) => {
        const animeImage = anime.images.jpg.image_url === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
            ? 'https://placehold.co/210x295/ffffff/666666/?text=TV'
            : anime.images.jpg.image_url;

        // Creamos el HTML de la tarjeta para cada anime
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
            <img src="${animeImage}" alt="${anime.title}" class="anime-image">
            <h3>${anime.title}</h3>
        `;
        animeCard.addEventListener('click', () => addFavorites(anime)); // Añadimos un evento para marcar como favorito
        resultsList.appendChild(animeCard); // Añadimos la tarjeta al contenedor de resultados
    });
   
    
}
//searchAnime()

//funcion para agregar o quitar favoritos

function addFavorites(anime){
    //es una funcion caqllback, mal_id es el identificador de series, anime.mal_id es el identificador de la serie actual que estamos verificando
    const favoriteIndex = favorites.findIndex(fav => fav.mal_id === anime.mal_id);  // Comprobamos si ya está en favoritos

//nos devolvera -1 cuando no no lo encuentre en favoritos, entonces lo agregamos 
    if(favoriteIndex === -1){
        //si no esta en favoritos, lo agregamos
        favorites.push(anime);
    }else{
        //si ya esta, lo eliminamos
        //si nos devuelve un numero procedemos a eliminarlo con splice
        favorites.splice(favoriteIndex, 1)
    }
//guardar fav en el LS
    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderFavorites()
}


//tenenemos que crear una funcion igual que la renderResults para favortios

function renderFavorites(){
    favoritesList.innerHTML = ''//para limpiar la lista de favoritos
    favorites.forEach((favorite) => {
        const favoriteItem = document.createElement('li');
        favoriteItem.innerHTML = `
            <img src="${favorite.images.jpg.image_url}" alt="${favorite.title}" class="favorite-image">
            <span>${favorite.title}</span>
            <button class="remove-favorite">x</button>
        `;
        // Evento para eliminar un favorito
        favoriteItem.querySelector('.remove-favorite').addEventListener('click', () => {
            favorites = favorites.filter((fav) => fav.mal_id !== favorite.mal_id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });
        //DOM, cuando el usuario agrega un fav, este codigo genera un nuevo 'li'// innerHTML
        favoritesList.appendChild(favoriteItem);
    });  
    
}

// funcion que hacemos para añadir al boton reset  que nos dejara la pagina limpia como al inicio

function resetPage() {
    resultsList.innerHTML = ''; // Limpiamos los resultados de búsqueda
    favoritesList.innerHTML = ''; // Limpiamos la lista de favoritos
    searchInput.value = ''; // Limpiamos el campo de búsqueda
    favorites = []; // Limpiamos el array de favoritos
    localStorage.removeItem('favorites')

}
//renderFavorites()
loadFavorites()







/* renderResults

 for (const anime of animeList) {
        const animeImage = anime.images.jpg.image_url === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png' // Esta URL es la que la API nos devuelve cuando no tiene imagen
            ? 'https://placehold.co/210x295/ffffff/666666/?text=TV'
            : anime.images.jpg.image_url; // Si no hay imagen, usamos la URL de la imagen real

        // Creamos el HTML de la tarjeta para cada anime
        const animeCardHTML = `
            <div class="anime-card">
                <img src="${animeImage}" alt="${anime.title}" class="anime-image">
                <h3>${anime.title}</h3>
            </div>
        `;

        // Agregar la tarjeta de anime al final de resultsList usando innerHTML
        resultsList.innerHTML += animeCardHTML;

        // Añadimos un evento para marcar como favorito al hacer clic en la tarjeta
        //const animeCard = resultsList.lastElementChild; // Obtenemos la última tarjeta añadida
        //animeCard.addEventListener('click', () => addFavorites(anime));

        const animeCard = resultsList.querySelectorAll('.anime-card');  // Seleccionamos todas las tarjetas
        //animeCard[animeCard.length].addEventListener('click', () => addFavorites(anime));  // Añadimos el evento al último elemento insertado
        animeCard.forEach(card => {
            card.addEventListener('click', () => addFavorites(anime));  // Añadimos el evento a cada tarjeta
        });

        //resultsList.appendChild(animeCard)





        renderFavorites

        for (const favorite of favorites) {
        const favoriteItemHTML = `
            <li>
                <img src="${favorite.images.jpg.image_url}" alt="${favorite.title}" class="favorite-image">
                <span>${favorite.title}</span>
            </li>
        `;


        favoritesList.innerHTML += favoriteItemHTML; // Agregamos el favorito al HTML

    }
*/