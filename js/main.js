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

//3.funcion buscar serie de anime 
//obtiene el valor del input de busqueda y hace una solicitud a la api

function searchAnime(){
    const inputValue = searchInput.value.trim()
    // Obtenemos el valor del input directamente, este valor usaremos para realizar la busqueda en la API
    //.trim() es un método de los strings (cadenas de texto) que elimina los espacios en blanco al principio y al final de la cadena
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/trim

    if (inputValue){//si el usuario ha escrito algo en el campo de busqueda, entonces se ejecugta lo siguiente
        fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)//usamos la url  de la api y ${} introducimo el nombre que desea buscar el usuario, promesa
        .then(answer => answer.json())//convertimos la respuesta en json
        .then(data => renderResults(data.data))//llamamos a renderResults con los datos obtenidos, esta funcion se encarga de tomar esos datos y mostrarlo al usuario, la hemos llamado data pero tambien se llama dat en la api
        .catch(error => console.error('error al buscar anime', error))//maneja los errores si algo sale mal durante la ejecucion de las promesas anteriores,si hay error se ejecutara esta linea y solo imprimira un error en la consola para que nosotros veamos si hay error
    }//si la busqueda tiene exito los resultados pasan a esta funcion //renderResults()
}


//3. mostrar resultados de la busqueda
//esta funcion la meteremos en el evento del boton Search  para que al clickar search nos pinte los resultados de la busqueda
//ESTA FUNCION ES LA QUE SE ENCARGA DE MOSTRAR VISUALMENTE LOS RESULTADOS DE LA BUSQUEDA DEL ANIME

function renderResults(animeList) {
    resultsList.innerHTML = ''; // Limpiamos los resultados previos en html antes de mostrar otros resultados
    //foreach es el metodo que recorre cada elemento del array animeList, que es el que contiene los datos obtenidos desde la API
    //creamos nuestro array
    animeList.forEach((anime) => {
        //primero creamos constante para la imagen, 
        const animeImage = anime.images.jpg.image_url === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'// esta URL es la que usa la API Jikan cuando no hay imagen disponible
            ? 'https://placehold.co/210x295/ffffff/666666/?text=anime'//si coincide usara esta imagen por defecto, hemos puesto el tamaño y que en la foto diga 'anime'
            : anime.images.jpg.image_url;
            //operador ternario, images.jpg.image_url es direccion donde esta imagen de anime en la API
            //jpg.image_url es la URL de la imagen en formato jpg
           //verifica si la url de la imagen coincide con esta url generica

        // Creamos  el elemento HTML de la tarjeta para cada anime
        const animeCard = document.createElement('div');//dom, crea un nuevo elemento en html que sera utilizado para mostrar la tarjetade un anime
        animeCard.className = 'anime-card';//asigna la clase de css al div creado y le aplica los estilos añadidos en css con esta clase
        animeCard.innerHTML = `
            <img src="${animeImage}" alt="${anime.title}" class="anime-image">
            <h3>${anime.title}</h3> 
            `;
        //define el contenido  HTML de la tarjeta (animeCard)
        //animeImage, llamamos a la const que creamos arriba y añadimos 
        //anime.title proviene de los datos de la API lo añadimos a alt por si no se genera la img, cree el texto alternativo y tambien en h3 para mostrar en el html
        animeCard.addEventListener('click', () => addFavorites(anime)); // cuando el usuario hace clicl en la tarjeta de un anime, llama a la funcion addFavorites que hemos creado mas abajo, marca o desmarca
        resultsList.appendChild(animeCard); // dom, añade animeCard a resultList en HTML se mostrara todas las tarjetas de los animes  que el usuario busco, añadira cada tarjeta(animeCard)
    });
     
}

//tenenemos que crear una funcion igual que la renderResults para favortios
//RENDERFAVORITES SE ENCARGA DE MOSTRAR LA LISTA DE ANIMES FAVORITOS ALMACENADOS EN EL ARRAY 'FAVORITES' Y PERMITE ELIMINARLOS DE ESA LISTA

function renderFavorites(){
    favoritesList.innerHTML = ''//para limpiar la lista de favoritos
    //foreach recorre cada elemento del array, contiene los animes que el usuario ha marcado como favoritos
    //nombre de nuestro array
    favorites.forEach((favorite) => {//favorite es cada elemento(anime) dentro del array favorites
        //creamos elemento con dom para el html
        const favoriteItem = document.createElement('li');//dom, este sera el contenedor para cada anime favorito
        //añadimos lo que queremos que aparezca en el li
        favoriteItem.innerHTML = `
            <img src="${favorite.images.jpg.image_url}" alt="${favorite.title}" class="favorite-image">
            <span>${favorite.title}</span>
            <button class="remove-favorite"> X </button>
        `;//hemos añadido un boton cuna clase para permitir eliminar este anime de la lista de favoritos
        //creamos constante llamando al boton desde la const de arriba para poder añadirle el evento click
        const removeBotton = favoriteItem.querySelector('.remove-favorite')
        // Evento click en el boton para eliminarlo de favoritos, especificamos que debe ocurrir cuando el usuario hace click en el boton
        removeBotton.addEventListener('click', () => {
            favorites = favorites.filter((fav) => fav.mal_id !== favorite.mal_id);//metodo filter, array que contenga todos los favoritos excepto el anime que el usuario ha eliminado, compara los identificadores, si es diferente al anime que queremos eliminar, ese anime se mantiene en el array, si coincide, se elimina
            //filter devuelve un nuevo array que contiene solo los animes que no han sido eliminados
            localStorage.setItem('favorites', JSON.stringify(favorites));//guardamos el nuevo array en LS y lo convierte en una cadena JSON y asi no se pierden cuando se recarga la pagina. al guardar la lista actualizada en Ls, el navegador recordara los favoritos 
            renderFavorites();// despues de eliminar un favorito  llamamos a rendderFavorites para actualizar la lista de favoritos en la pagina para que la visualice el usuario
        });
        //DOM, cuando el usuario agrega un fav, este codigo genera un nuevo 'li'// innerHTML
        //necesitamos agregar cada elemento de la lista de favoritos (favoriteItem) al contenedor favoritesList para que se muestre en la pagina
        favoritesList.appendChild(favoriteItem);
    });  
    
}

//funcion que se encarga de agregar o eliminar un anime de lalista de favoritos
//toma como parametro un objeto (anime) que representa el anime que el usuario desea agregar o eliminar de los favoritos

function addFavorites(anime){
    //es una funcion callback, mal_id es el identificador de series, anime.mal_id es el identificador de la serie actual que estamos verificando
    const favoriteIndex = favorites.findIndex(fav => fav.mal_id === anime.mal_id);  // Comprobamos si ya está en favoritos
    

//nos devolvera -1 cuando no lo encuentre en favoritos, entonces lo agregamos 
    if(favoriteIndex === -1){
        //si no esta en favoritos, lo agregamos usando push, este metodo añade el objeto anime al final del array favorites
        favorites.push(anime);
    }else{
        //si ya esta, lo eliminamos
        //si nos devuelve un numero procedemos a eliminarlo con splice
        favorites.splice(favoriteIndex, 1)
    }
//despues de agregar o eliminar, actualizamos la lista guardada en LS para mantener los cambios actualizados     
//convierte el array de favorites(que es un objeto en JS) en una cadena JSON
    localStorage.setItem('favorites', JSON.stringify(favorites));
//depsues de actualizar los datos del LS, llamamos a la funcion renderFavorites para renderizar la lista de favoritos actualizada en la interfaz del usuario
    renderFavorites()
}

//se encarga de cargar los favoritos en localstorage al iniciar la pagina
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');//esta funcion devuelve la cadena de texto que se guardo con la clave favorites(si existe)
    if (storedFavorites) {//condicion que comprueba si storedFavorites tiene algun valor, si los favoritos estan almacenados en LS
        favorites = JSON.parse(storedFavorites); // si hay  favoritos  los convertimos de vuelta en cadena JSON a objeto, convierte la cadena JSON en arrya de animes y Recuperamos los favoritos desde localStorage
        renderFavorites(); // despues de recuperar los fav llamamos a renderFavorites para renderizar la lista de fav en la pagina 
    }
}


// funcion que hacemos para añadir al boton reset  que nos dejara la pagina limpia como al inicio
//esta funcion restablece completamente el estado de la pagina, reinicia la pagina

function resetPage() {
    resultsList.innerHTML = ''; // Limpiamos los resultados de búsqueda
    favoritesList.innerHTML = ''; // Limpiamos la lista de favoritos
    searchInput.value = ''; // Limpiamos el campo de búsqueda
    favorites = []; // Limpiamos el array de favoritos
    localStorage.removeItem('favorites')//elimina la clave 'favorites' del LS, elimina el elemnto del almacenamiento local del navegador 

}


//1.añadimos evento en el boton buscar,
//añadimos la funcion searchAnime que obtiene el valor del input de busqueda y hace una solicitud a la api

searchButton.addEventListener('click', (event) =>{
    event.preventDefault()//previene que se recargue la pagina al hacer clic en el boton 
    //console.log('boton presionado')
    searchAnime()//llamamos a la funcion, es la que obtiene los datos de la API basados en el valor que se escribe en el input de busqueda y muestra los resultados en la pagina
})


//añadimos evento en el boton reset
//escuchamos el evento click, y al hacer click se reinicia, necesitamos la funcion resetPAge que es la que se encarga de limpiar tosdos los campos 

resetButton.addEventListener('click', (event) =>{
    event.preventDefault()
    //console.log('reset')
    resetPage()// despues de prevenir el comportamiento por defecto, llamamos a la funcion que restablece la pagina a su estado inicial
})


loadFavorites()// llama a la funcion, porqiue es la responsable de cargar los favoritos que estan guardados en LS cuando la pagina se carga, la llamamos aqui para asegurarnos que se carguen automaticamente cuando se carga la pagina, mostrando los animes que el usuario haya marcado como favoritos en una sesion anterior 
