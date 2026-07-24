import { fetchDataController, state, searchController, postDataController } from "./controller.js";
import { debounce, removeErrorUis, removeActiveClasses, reSetErrorUi, reSetSuccessUi, restFrom } from "./utils.js";
import { validateFrom } from "./AddProductFormValidations.js";
import { renderEditProductForm } from "./UIworks.js";

// ================ LOGIC STARTER API CALL =====================
// fetchDataController();

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
    document.querySelector('html').classList.add('scroll-pt-30')
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

// ====================================== ADD PRODUCT FORM VALIDATION TRIGGER LOGIC ========================================
const addProductFromContainer = document.getElementById('add_product_form_container');
const addProductFrom = document.getElementById('add_product_form');
addProductFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataObject = validateFrom(addProductFromContainer);
    if(!dataObject) return;
    postDataController(dataObject);
})

// ====================================== EDIT PRODUCT FORM VALIDATION TRIGGER LOGIC ========================================
const selectEditFieldsModal = document.getElementById('select_edit_filed_modal');
const productContainer = document.querySelector('.products_container');
productContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit_product_btn');
    const productInfo = state.allProducts.find(product => product.id === btn.dataset.editId)
    // console.log(productInfo);
    const productNameElem = selectEditFieldsModal.querySelector('.product-info-title  span');
    const productName = productInfo.title;
    //clearing contents in select fields modal 
    productNameElem.textContent = '';
    selectEditFieldsModal.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false)
    
    productNameElem.textContent = productName;
    selectEditFieldsModal.showModal();

    // ===================== full edit the product button working =======================
    const fullEditBtn = selectEditFieldsModal.querySelector('.full_edit_btn');
    fullEditBtn.addEventListener('click', () => { // if the user wants to full edit the product
        const selectForm = document.getElementById('select_edit_fields_form');
        const selectedFields = selectForm.querySelectorAll('input[type="checkbox"]');
        const filedArray = Array.from(selectedFields);
        // send fields array to the UI form render function
        renderEditProductForm(filedArray, btn.dataset.editId);
        selectEditFieldsModal.close();
    })

    // 
    const submitBtn = selectEditFieldsModal.querySelector('#submit_select_form');
    submitBtn.addEventListener('click', () => {
        const selectForm = document.getElementById('select_edit_fields_form');
        const selectedFields = selectForm.querySelectorAll('input[type="checkbox"]:checked');
        const filedArray = Array.from(selectedFields);
        // send fields array to the UI form render function
        renderEditProductForm(filedArray, btn.dataset.editId);
        selectEditFieldsModal.close();
    })
})

// close select-fields modal
const closeModal = selectEditFieldsModal.querySelector('.close-modal');
closeModal.addEventListener('click', () => {selectEditFieldsModal.close()});

// ====================================== PRODUCT IMAGE DRAG AND DROP LOGIC FOR ADD PRODUCT FORM ========================================
// product image drag n drop logic
const addProductImageInput = document.getElementById('add_product_form_product_image_input');
const addProductImageDropArea = addProductImageInput.parentElement;
const addProductImageSuccessElement = document.querySelector('.add-product-img-success-preview-elem');

addProductImageInput.addEventListener('change', () => {
    const imageFile = addProductImageInput.files[0]
    if (!imageFile) return;
    addProductImageSuccessElement.classList.remove('hidden')
    addProductImageSuccessElement.querySelector('span').textContent = imageFile.name;
})

addProductImageDropArea.addEventListener('dragover', (e) => {e.preventDefault()});
addProductImageDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0]
    if (!imageFile) return;
    addProductImageSuccessElement.classList.remove('hidden')
    addProductImageSuccessElement.querySelector('span').textContent = imageFile.name;
});


const editProductImageInput = document.getElementById('edit_product_form_product_image_input');
const editProductImageDropArea = editProductImageInput.parentElement;
const editProductImageSuccessElement = document.querySelector('.edit-product-img-success-preview-elem');

editProductImageInput.addEventListener('change', () => {
    const imageFile = editProductImageInput.files[0]
    if (!imageFile) return;
    editProductImageSuccessElement.classList.remove('hidden')
    editProductImageSuccessElement.querySelector('span').textContent = imageFile.name;
});

editProductImageDropArea.addEventListener('dragover', (e) => {e.preventDefault()});
editProductImageDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0]
    if (!imageFile) return;
    editProductImageSuccessElement.classList.remove('hidden')
    editProductImageSuccessElement.querySelector('span').textContent = imageFile.name;
});

const discardBtn = document.querySelectorAll('.form-discard-btn'); // when the user clicks on discard button to clear the form.
discardBtn.forEach(btn => {
    btn.addEventListener('click', () => {  
        restFrom(addProductFrom);
        restFrom(document.getElementById('edit_product_form'));
    })
})

// ====================================== CLOSE SUCCESS & ERROR STATES OF FORM LOGIC ======================================\
const closeModalButtons =  document.querySelectorAll('.modal-close');
closeModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const parentElm = e.target.parentElement.parentElement;
        parentElm.close();
        console.log(parentElm)
    })
})

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