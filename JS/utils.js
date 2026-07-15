export { isUiLoading };
import { state } from "./controller.js";

const productsCardsContainer = document.querySelector('.products_container');
const categoryDetailsElement = document.querySelector('.category_details');
const loadingProductCardTemplate = document.getElementById('loading_product_card_template')

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
    }
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