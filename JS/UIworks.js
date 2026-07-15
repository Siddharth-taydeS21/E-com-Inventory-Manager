export { renderData };

// ======================= PRIMARY RENDER FUNCTION ==============================
const productCardTemplate = document.getElementById('product_card_template');
const productsCardsContainer = document.querySelector('.products_container');

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