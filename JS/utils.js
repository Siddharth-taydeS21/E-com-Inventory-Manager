export { isUiLoading, debounce, removeErrorUis, removeActiveClasses };
import { state } from "./controller.js";

const productsCardsContainer = document.querySelector('.products_container');
const categoryDetailsElement = document.querySelector('.category_details');
const loadingProductCardTemplate = document.getElementById('loading_product_card_template');
const notFoundErrorTemplate = document.getElementById('not_found_template');
const productsSection = document.getElementById('products');

// ==============================================================================
const removeErrorUis = () => {
    const errorCards = document.querySelectorAll('#error');
        errorCards.forEach(card => {
            if(card){
                card.remove();
            }
        })
}

// ==============================================================================
const removeActiveClasses = () => {
    const navLinks = document.querySelectorAll('.nav_links');
    navLinks.forEach(link => {
        const aTags = link.querySelector('a');
        if (aTags.className.includes('active')) {
            aTags.classList.remove('active');
        }
    })
}

// ======================= LOADING/ERROR STATES UI FUNCTION ========================= 
const isUiLoading = () => {
    if(state.Loading === true){
        const spans = categoryDetailsElement.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.add('hidden');
        })

        categoryDetailsElement.innerHTML += `
            <div class="spinner size-[22px] border-3 border-gray-100 border-t-gray-300 border-l-gray-300 rounded-full animate-spin"></div>
            <p class="loading_text">Loading...</p>
        `;

        for (let i = 0; i <= 7; i++) {
            productsCardsContainer.append(
                loadingProductCardTemplate.content.cloneNode(true)
            )
        }
    }else if (state.Loading === 'not-found'){
        const container = productsSection.querySelector('.container');

        //if container already has previous error cards
        removeErrorUis();

        const errorCard = notFoundErrorTemplate.content.cloneNode(true);
        const searchInput = document.getElementById('search-input');
        errorCard.querySelector('.keyWord').textContent = searchInput.value;

        container.append(errorCard);
        document.getElementById('product_count').textContent = '...';
        document.getElementById('category').textContent = 'No Products';
    }
    // not found state
    // error state
    else if(state.Loading === false){
        const spans = categoryDetailsElement.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.remove('hidden');
        })
        categoryDetailsElement.querySelector('.spinner').remove();
        categoryDetailsElement.querySelector('.loading_text').remove();
        const loadingCards = document.querySelectorAll('#Loading_product_card');
        loadingCards.forEach(card => {
            card.remove();
        });
    }

} 

// ======================= DEBOUNCING ON SEARCH LOGIC ========================= 
// ====================== CORE DEBOUNCING LOGIC ==================== //
const debounce = (callback, delay = 500) => {
    let timeOut;

    return function (...args) {
        if (timeOut) {
            clearTimeout(timeOut)
        }
        timeOut = setTimeout(() => {
            callback(...args)
        }, delay)
    }
 
}
