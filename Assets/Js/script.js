let currentPage = 1; //<- Maneja la página actual (1 inicialmente)
const pagesPerLoad = 1; //<- El número de páginas que cargarán cuando necesitemos ver más personajes.
let isLoading = false; //<- Avisa cuando estamos cargando los siguientes personajes.
let totalPages = 42; //<- número total o máximo de páginas a cargar.
let selectedCategory = "All"; //<- categoría seleccionada (todos los personajes por defecto)

//-> Función para obtener a los personajes. Esta tiene 2 parámetros, desde que página a que página.
async function GetCharacters(fromPage, toPage) {

    //-> Guardamos en una variable el numero de paginas que queremos recorrer.
    const pageNumbers = [];
    for (let i = fromPage; i <= toPage; i++) {
        pageNumbers.push(i);
    }

    //-> Pasamos por el numero de páginas que recorrimos y guardamos las "promesas".
    const fetches = pageNumbers.map(page =>
        fetch(`https://rickandmortyapi.com/api/character/?page=${page}`).then(res => res.json())
    );

    //-> Esperamos a que se carguen las peticiones o promesas de la api.
    const results = await Promise.all(fetches);
    const allCharacters = results.flatMap(r => r.results); //<- "aplana" el elemento y lo guarda en una lista, es decir, que si es "results[1, 2] queda como "[1, 2]"".
    return allCharacters;
}

//-> Obtenemos el selector de personajes para filtrar.
const select = document.querySelector('.form-select');

//-> Escuchar a la selección del filtro.
function FilterListener(){
select.addEventListener('change', () => {
    let selectedOption = select.value;

    switch (selectedOption) {
        case "1": selectedCategory = "Human"; break;
        case "2": selectedCategory = "Humanoid"; break;
        case "3": selectedCategory = "Alien"; break;
        case "4": selectedCategory = "Mythological Creature"; break;
        default: selectedCategory = "All";
    }

    characterSection.innerHTML = ""; //<- Limpiar personajes anteriores
    currentPage = 1;
    RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
    currentPage += pagesPerLoad;
});
}

//-> Llamamos a la función.
FilterListener();

//-> Función para obtener a la categoría de los personajes, con dos parámetros: los personajes cargados y el nombre de la categoría.
function GetCategory(characters, nameCategory) {
    if (nameCategory === "All") return characters; //-> Mostrar todos si selecciona "All"
    return characters.filter(character => character.species === nameCategory); //-> mostrar los seleccionados.
}

//-> Escuchamos el scroll para cargar los personajes al scrollear a cierta distancia del final.
window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300 && !isLoading && currentPage <= totalPages) {
        RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
        currentPage += pagesPerLoad;
    }
});

//-> Verificamos si la cantidad de personajes no alcanza a generar un scroll, para generar más personajes hasta crear el scroll.
function checkScrollAndLoadMore() {
    const body = document.body;
    const html = document.documentElement;
    const contentHeight = Math.max(body.scrollHeight, html.scrollHeight);
    const viewportHeight = window.innerHeight;

    if (contentHeight <= viewportHeight + 100 && currentPage <= totalPages && !isLoading) {
        RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
        currentPage += pagesPerLoad;
    }
}

//-> Obtenemos el character.
const characterSection = document.querySelector(".characters");

//-> Función que renderiza a los personajes en las cards del bootstrap.
async function RenderCharacter(category, fromPage, toPage) {
    isLoading = true;

    const charactersData = await GetCharacters(fromPage, toPage);
    const filteredCharacters = GetCategory(charactersData, category);

    let template = "";
    filteredCharacters.forEach((c, i) => {
        template +=
            `
        <div class="card popup-anim" style="width: 12rem; animation-delay: ${i * 100}ms;">
            <img src="${c.image}" class="card-img-top" alt="${c.name}">
            <div class="card-body">
                <h5 class="card-title">${c.name}</h5>
                <p class="card-text">${c.species}</p>
                <p class= "card-status">${c.status}</a>
            </div>
        </div>
        `;
    });

    characterSection.insertAdjacentHTML("beforeend", template);
    isLoading = false;
    checkScrollAndLoadMore(); s
}

//-> Llama a la función.
RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
