import { fetchDataController, state, searchController } from "./controller.js";
import { debounce, removeErrorUis, removeActiveClasses } from "./utils.js";

// ================ LOGIC STARTER API CALL =====================
fetchDataController();

// ============================= NAV LIST OPEN & CLOSE LOGIC =========================================
const nav = document.querySelector('nav');
const navMenu = document.querySelector('.nav_Menu');
const navOpen = document.getElementById('nav_list_open');
const navClose = document.getElementById('nav_list_close');
const navLinks = document.querySelectorAll('.nav_links');


navOpen.addEventListener('click', () => { navMenu.classList.replace('max-md:right-[-120%]', 'max-md:right-0') });
navClose.addEventListener('click', () => { navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]') });
window.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
        navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')
        return;
    }
    return;
})

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')
    })
})

// ========================================= CATEGORY FEATURE LOGIC ================================================
const allProducts = document.getElementById('allProducts');
const electronicsCategory = document.getElementById('electronics');
const fashionCategory = document.getElementById('fashion');
const beautyCategory = document.getElementById('beauty');
const productsCardsContainer = document.querySelector('.products_container');

allProducts.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products');
    removeActiveClasses();
    allProducts.classList.add('active');
})

fashionCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Fashion');
    removeActiveClasses();
    fashionCategory.classList.add('active');
})

beautyCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Beauty');
    removeActiveClasses();
    beautyCategory.classList.add('active');
})

electronicsCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Electronics');
    removeActiveClasses();
    electronicsCategory.classList.add('active');
})

// ========================================= SEARCH FEATURE LOGIC ================================================ 
const searchInput = document.getElementById('search-input');

const debounceSearch = debounce((text) => {
    if (text.trim() === '') return;
    const keyWord = text.toLowerCase();

    const searchResults = [];

    state.allProducts.forEach(product => {
        
            const searchTagsArray = product.search_tags;
            searchTagsArray.forEach(item => {
                if (item.includes(keyWord)) {
                    if (searchResults.includes(product)) return;
                    searchResults.push(product);
                }
            })
        
    })

    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    searchController(searchResults);
    searchInput.blur();

}, 1000);

searchInput.addEventListener('input', (e) => {
    debounceSearch(e.target.value)
});