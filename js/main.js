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
    //foreach es el metodo que recorre cada elemento del array, que es el que contiene los datos obtenidos desde la API
    //creamos nuestro array
    animeList.forEach((anime) => {
        //operador ternario, anime.images es direccion donde esta image de anime
        //jpg.image_url es la URL de la imagen en formato jpg
        //verifica si la url de la imagen coincide con esta url generica
        const animeImage = anime.images.jpg.image_url === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
            ? 'https://placehold.co/210x295/ffffff/666666/?text=anime'//si no coincide usara esta imagen por defecto
            : anime.images.jpg.image_url;

        // Creamos  el elemento HTML de la tarjeta para cada anime
        const animeCard = document.createElement('div');//dom
        animeCard.className = 'anime-card';//css
        animeCard.innerHTML = `
            <img src="${animeImage}" alt="${anime.title}" class="anime-image">
            <h3>${anime.title}</h3>
        `;//animeImage, llamamos a la const que creamos arriba y añadimos anime.title a alt por si no se genera la img cree el texto alternativo y tambien en h3 para mostrar en html
        animeCard.addEventListener('click', () => addFavorites(anime)); // Añadimos un evento para marcar como favorito, callback, marca y desmarca
        resultsList.appendChild(animeCard); // Añadimos la tarjeta al contenedor de resultados, se agrega  al html mediante DOM
    });
     
}
//searchAnime()

//tenenemos que crear una funcion igual que la renderResults para favortios

function renderFavorites(){
    favoritesList.innerHTML = ''//para limpiar la lista de favoritos
    //foreach es el metodo que recorre cada elemento del array, que es el que contiene los datos obtenidos desde la API
    //nombre de nuestro array
    favorites.forEach((favorite) => {
        //creamos elemento con dom para el html
        const favoriteItem = document.createElement('li');
        //añadimos lop que queremos que aparezca en el li
        favoriteItem.innerHTML = `
            <img src="${favorite.images.jpg.image_url}" alt="${favorite.title}" class="favorite-image">
            <span>${favorite.title}</span>
            <button class="remove-favorite"> X </button>
        `;
        //creamos constante llamando al boton desde la const de arriba 
        const removeBotton = favoriteItem.querySelector('.remove-favorite')
        // Evento click en el boton para eliminar un favorito
        removeBotton.addEventListener('click', () => {
            favorites = favorites.filter((fav) => fav.mal_id !== favorite.mal_id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });
        //DOM, cuando el usuario agrega un fav, este codigo genera un nuevo 'li'// innerHTML
        favoritesList.appendChild(favoriteItem);
    });  
    
}

//funcion para agregar o quitar favoritos

function addFavorites(anime){
    //es una funcion callback, mal_id es el identificador de series, anime.mal_id es el identificador de la serie actual que estamos verificando
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

//cargar favoritos en localstorage al iniciar
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites); // Recuperamos los favoritos desde localStorage
        renderFavorites(); // Renderizamos los favoritos al cargar la página
    }
}




// funcion que hacemos para añadir al boton reset  que nos dejara la pagina limpia como al inicio

function resetPage() {
    resultsList.innerHTML = ''; // Limpiamos los resultados de búsqueda
    favoritesList.innerHTML = ''; // Limpiamos la lista de favoritos
    searchInput.value = ''; // Limpiamos el campo de búsqueda
    favorites = []; // Limpiamos el array de favoritos
    localStorage.removeItem('favorites')

}


//1.evento de busqueda en el boton buscar, añadimos la funcion searchAnime que obtiene el valor del input de busqueda y hace una solicitud a la api
searchButton.addEventListener('click', (event) =>{
    event.preventDefault()
    //console.log('boton presionado')
    searchAnime()

})


//evento de reset en el boton 

resetButton.addEventListener('click', (event) =>{
    event.preventDefault()
    //console.log('reset')
    resetPage()
    
})


//renderFavorites()
loadFavorites()
