export { renderData, isUiLoading };
import { state } from "./controller.js";

const productCardTemplate = document.getElementById('product_card_template');
const productsCardsContainer = document.querySelector('.products_container');
const categoryDetailsElement = document.querySelector('.category_details');
const loadingProductCardTemplate = document.getElementById('loading_product_card_template')

const productsCategoryElement = document.getElementById('category');
const TotalProductsElement = document.getElementById('product_count');

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

// ======================= PRIMARY RENDER FUNCTION ==============================
const renderData = (products) => {

    if(products.length === 50){
        document.getElementById('category').textContent = 'All Products'
    }else{
        document.getElementById('category').textContent = `${products[0].category} Products`
    }
    const productsLength = products.length;
    document.getElementById('product_count').textContent = productsLength;


    products.forEach((product) => {
        // ============= PRODUCT DETAILS EXTRACTION ========
        const productId = product.id;
        const productTile = product.title;
        const productImage = product.image_url;
        const productBrandName = product.brand;
        const productRatings = product.ratings;
        const productRatingsCount = product.rating_count;
        const productPrice = product.price;
        const productDiscountedPrice = product.discounted_price;
        const productDiscountedPercentage = product.discount_percentage;
        const productDeliveryTime = product.estimated_delivery_time;

        const card = productCardTemplate.content.cloneNode(true);
        card.querySelector('.product_image').src = productImage;
        card.querySelector('.product_title').textContent = productTile;
        card.querySelector('.product_brand').textContent = productBrandName;
        card.querySelector('.ratings_numbers').textContent = productRatings;
        card.querySelector('.ratings_count').textContent = `(${productRatingsCount}) Ratings`;
        card.querySelector('.product_price').textContent = `₹${productDiscountedPrice.toLocaleString('en-IN')}`;
        card.querySelector('.discounted_price').textContent = `₹${productPrice.toLocaleString('en-IN')}`;
        card.querySelector('.discounted_percentage').textContent = `${productDiscountedPercentage}% off`;
        card.querySelector('.delivery_time').textContent = productDeliveryTime;

        productsCardsContainer.append(card);
    });
}