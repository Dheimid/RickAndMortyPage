let currentPage = 1;
const pagesPerLoad = 1;
let isLoading = false;
let totalPages = 42;
let selectedCategory = "All";

async function GetCharacters(fromPage, toPage) {
    const pageNumbers = [];
    for (let i = fromPage; i <= toPage; i++) {
        pageNumbers.push(i);
    }

    const fetches = pageNumbers.map(page =>
        fetch(`https://rickandmortyapi.com/api/character/?page=${page}`).then(res => res.json())
    );

    const results = await Promise.all(fetches);
    const allCharacters = results.flatMap(r => r.results);
    return allCharacters;
}

const select = document.querySelector('.form-select');

select.addEventListener('change', () => {
    let selectedOption = select.value;

    switch (selectedOption) {
        case "1": selectedCategory = "Human"; break;
        case "2": selectedCategory = "Humanoid"; break;
        case "3": selectedCategory = "Alien"; break;
        case "4": selectedCategory = "Mythological Creature"; break;
        default: selectedCategory = "All";
    }

    characterSection.innerHTML = ""; // Limpiar personajes anteriores
    currentPage = 1;
    RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
    currentPage += pagesPerLoad;
});

function GetCategory(characters, nameCategory) {
    if (nameCategory === "All") return characters; // Mostrar todos si selecciona "All"
    return characters.filter(character => character.species === nameCategory);
}

window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300 && !isLoading && currentPage <= totalPages) {
        RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);
        currentPage += pagesPerLoad;
    }
});

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

const characterSection = document.querySelector(".characters");

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

RenderCharacter(selectedCategory, currentPage, currentPage + pagesPerLoad - 1);