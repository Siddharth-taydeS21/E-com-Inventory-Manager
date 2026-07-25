import { state } from "./controller";
import { resetEditForm, restFrom } from "./utils.js";
export { renderData, renderEditProductForm };

// ======================= PRIMARY RENDER FUNCTION ==============================
const productCardTemplate = document.getElementById('product_card_template');
const productsCardsContainer = document.querySelector('.products_container');

const renderData = (products) => {
    // document.getElementById('container_category').textContent = `All Products`;
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
        card.querySelector('.edit_product_btn').dataset.editId = productId;
        card.querySelector('.delete_product_btn').dataset.deleteId = productId;

        productsCardsContainer.append(card);
    });

    // const editButtonsbatch = document.querySelectorAll('')
}

// ======================= EDIT FORM RENDER ON UI LOGIC ==============================
const addProductFormContainer = document.getElementById('add_product_form_container');
const editProductFormContainer = document.getElementById('edit_product_form_container');

const renderEditProductForm = (array, dataId) => {
    // remove previous edit fields
    resetEditForm(editProductFormContainer);
    restFrom(editProductFormContainer.querySelector('form'));
    

    // if user closes the from OR he closes the form after making some changes, for this we have close form btn
    const closeFormBtn = editProductFormContainer.querySelector('.edit-form-close-btn');
    closeFormBtn.addEventListener('click', () => {
        addProductFormContainer.classList.remove('hidden'); // add product form visible, 
        editProductFormContainer.classList.add('hidden'); // edit product form hidden 
        resetEditForm(editProductFormContainer); // reset edit form 
        restFrom(editProductFormContainer); // reset edit form inputs
    })

    // console.log(array);
    // get product Information
    const productInfo = state.allProducts.find(product => product.id === dataId);
    const productNameElem = editProductFormContainer.querySelector('.product-info-title  span');
    const productName = productInfo.title;
    productNameElem.textContent = productName;

    // get all form control fields form array
    // remove hidden classes
    array.forEach(inputField => {
        const formControlElem = document.getElementById(`${inputField.value}`);
        formControlElem.classList.remove('hidden');
    })

    // // get all input fields of edit form 
    const inputFields = editProductFormContainer.querySelectorAll('.input-field');

    inputFields.forEach(filed => {
        const fieldsArray = Array.from(filed.querySelectorAll('.form-control'));
        if (fieldsArray.every(el => el.className.includes('hidden'))) { // if every element in the input field is hidden it means user not selected that, return
            return;
        } else if (fieldsArray.every(el => !el.className.includes('hidden'))) { // if every element in the input field is not hidden it means user selected both elements, keep grid-col-2
            return;
        } else if (fieldsArray.some(el => el.className.includes('hidden'))) { // if one element in the input field is hidden it means user selected 1 elements, change layout to grid-col-1
            filed.classList.remove('md:grid-cols-2');
        }
        // console.log(fieldsArray)
    })

    const newArr = Array.from(editProductFormContainer.querySelectorAll('.form-control')).filter(el => !el.className.includes('hidden')); // select all .form-control elements who don't has the class hidden
    const last2elms = newArr.slice(-2); // find last 2 in array

    // if user selected only one field to edit 
    if (last2elms.length === 1) {
        if (last2elms[0].className.includes('mb-15')) last2elms[0].classList.replace('mb-15', 'mb-4');
    } else {
        const parent1 = last2elms[0].parentElement;
        const parent2 = last2elms[1].parentElement;
        // console.log(parent1)
        // console.log(parent2)

        // check if both's parent elements is same // check if both's parent elements is same 
        if (parent1 === parent2) { // if yes, remove both's margin bottom
            if (last2elms[0].className.includes('mb-15')) last2elms[0].classList.replace('mb-15', 'mb-4');
            if (last2elms[1].className.includes('mb-15')) last2elms[1].classList.replace('mb-15', 'mb-4');
            parent1.classList.add('md:grid-cols-2');
        } else { // if no, remove only last one's margin bottom  
            if (last2elms[1].className.includes('mb-15')) last2elms[1].classList.replace('mb-15', 'mb-4');
        }
    }

    addProductFormContainer.classList.add('hidden') // add product form hidden, 
    editProductFormContainer.classList.remove('hidden') // edit product form visible 

    document.querySelector('#add_edit_products').scrollIntoView({ behavior: "smooth" }); // scroll to form -
    // rest will do the validate() function & postData() function


}