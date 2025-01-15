'use strict'

/* 
pasos a seguir
1.obtener elementos del HTML/ 
2.escuchar el evento de busqueda(click en el boton de buscar)
3.Buscar las serie de anime (funcion)
4.mostrar los resultados d la busqueda (funcion)
5 gestionar los favoritos
6.mostrar Favoritos, otra funcion
7.eliminar favoritos, funcion

*/

//Seleccion de elementos del HTML con sus respectivas clases 

const searchInput = document.querySelector('.js_search-input')
const searchButton = document.querySelector('.js_search-button')
const resultsList = document.querySelector('.js_results-list')
const favoritesList = document.querySelector('.js_favorites-list')
const resetButton = document.querySelector('.js_reset-button')

//array para almacenar favoritos
let favorites = [];



//1.evento de busqueda en el boton buscar
searchButton.addEventListener('click', (event) =>{
    event.preventDefault()
    console.log('boton presionado')
    searchAnime()

})


//evento de reset en el boton 

resetButton.addEventListener('click', (event) =>{
    event.preventDefault()

})

//2.funcion buscar serie de anime 

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
    }

}


//mostrar resultados de la busqueda
//esta funcion la meteremos en la funcion SearchAnimepara que al llamar a search anime nos pinte los resultados de la busqueda

function renderResults(animeList) {
    resultsList.innerHTML = ''; // Limpiamos los resultados previos
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
        const animeCard = resultsList.lastElementChild; // Obtenemos la última tarjeta añadida
        animeCard.addEventListener('click', () => toggleFavorite(anime));
    }
}
searchAnime()