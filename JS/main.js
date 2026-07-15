import { fetchDataController } from "./controller.js";

// ================ LOGIC STARTER API CALL =====================
fetchDataController();

// ============================= NAV LIST OPEN & CLOSE LOGIC =========================================
const nav = document.querySelector('nav');
const navMenu = document.querySelector('.nav_Menu');
const navOpen = document.getElementById('nav_list_open');
const navClose = document.getElementById('nav_list_close');


navOpen.addEventListener('click', () => {navMenu.classList.replace('max-md:right-[-120%]', 'max-md:right-0')});
navClose.addEventListener('click', () => {navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')});
window.addEventListener('click', (e) => {
    if(!nav.contains(e.target)){
        navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')
        return;
    }
    return;
})

// ========================================= CATEGORY FEATURE LOGIC ================================================
const allProducts = document.getElementById('allProducts');
const electronicsCategory = document.getElementById('electronics');
const fashionCategory = document.getElementById('fashion');
const beautyCategory = document.getElementById('beauty');
const productsCardsContainer = document.querySelector('.products_container');

allProducts.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products');
})

fashionCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Fashion');
})

beautyCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Beauty');
})

electronicsCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Electronics');
})