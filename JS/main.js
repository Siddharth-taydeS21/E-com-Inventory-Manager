import { fetchDataController, state, searchController, postDataController } from "./controller.js";
import { debounce, removeErrorUis, removeActiveClasses, reSetErrorUi, reSetSuccessUi, restFrom } from "./utils.js";
import { validateFrom } from "./formValidations.js";
import { renderEditProductForm } from "./UIworks.js";
import { deleteData } from "./APIworks.js";

// ================ LOGIC STARTER API CALL =====================
fetchDataController();

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
    document.getElementById('container_category').textContent = 'All Products'
})

fashionCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Fashion');
    removeActiveClasses();
    fashionCategory.classList.add('active');
    document.getElementById('container_category').textContent = 'Fashion Products'
})

beautyCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Beauty');
    removeActiveClasses();
    beautyCategory.classList.add('active');
    document.querySelector('html').classList.add('scroll-pt-30');
    document.getElementById('container_category').textContent = 'Beauty Products'
})

electronicsCategory.addEventListener('click', () => {
    productsCardsContainer.innerHTML = '';
    removeErrorUis();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/?category=Electronics');
    removeActiveClasses();
    electronicsCategory.classList.add('active');
    document.getElementById('container_category').textContent = 'Electronics Products'
})

// ========================================= SEARCH FEATURE LOGIC ================================================ 
const searchInput = document.getElementById('search-input');

const debounceSearch = debounce((text) => {
    if (text.trim() === '') return;
    const keyWord = text.trim().toLowerCase();

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

searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    debounceSearch(e.target.value)
});

// ====================================== ADD PRODUCT FORM VALIDATION TRIGGER LOGIC ========================================
const addProductFromContainer = document.getElementById('add_product_form_container');
const addProductFrom = document.getElementById('add_product_form');
addProductFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataObject = validateFrom(addProductFromContainer);
    if (!dataObject) return;
    postDataController({ data: dataObject });
})

// ====================================== EDIT PRODUCT MODAL TRIGGER LOGIC ========================================
const selectEditFieldsModal = document.getElementById('select_edit_filed_modal');
const selectFiledSubmitBtn = selectEditFieldsModal.querySelector('#submit_select_form');
const selectFiledErrorMsg = selectEditFieldsModal.querySelector('.select-filed-error-msg');
const fullEditBtn = selectEditFieldsModal.querySelector('.full_edit_btn');
const productContainer = document.querySelector('.products_container');
productContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit_product_btn');
    if (!e.target.className.includes('edit_product_btn') && (!e.target.parentElement.className.includes('edit_product_btn') && !e.target.className.includes('ri-pencil-fill'))) return;
    const productInfo = state.allProducts.find(product => product.id === btn.dataset.editId)
    const productNameElem = selectEditFieldsModal.querySelector('.product-info-title  span');
    const productName = productInfo.title;
    const productId = productInfo.id;

    //clearing contents in select fields modal 
    productNameElem.textContent = '';
    selectEditFieldsModal.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false)

    productNameElem.textContent = productName;
    if (!selectFiledErrorMsg.className.includes('hidden')) selectFiledErrorMsg.classList.add('hidden');
    selectEditFieldsModal.showModal();
    selectFiledSubmitBtn.dataset.editId = productId;
    fullEditBtn.dataset.editId = productId;
    state.current_product_edit_id = productInfo.id;
})

// ===================== GET ONLY SELECTED FIELDS TO EDIT FORM THE EDIT FIELDS MODAL - LOGIC =======================
selectFiledSubmitBtn.addEventListener('click', () => {
    const selectForm = document.getElementById('select_edit_fields_form');
    const selectedFields = selectForm.querySelectorAll('input[type="checkbox"]:checked');
    if (selectedFields.length === 0) {
        selectFiledErrorMsg.classList.remove('hidden');
        return;
    }
    const filedArray = Array.from(selectedFields);
    filedArray.forEach(input => {
        if (input.value === 'product_price_filed') {
            const inputs = Array.from(document.querySelectorAll('input[name="edit-filed"]'));
            const el = inputs.find(input => input.value === 'product_discounted_price_filed');
            el.checked = true;
        }
        if (input.value === 'product_discounted_price_filed') {
            const inputs = Array.from(document.querySelectorAll('input[name="edit-filed"]'));
            const el = inputs.find(input => input.value === 'product_price_filed');
            el.checked = true;
        }
    })
    const newFieldsArray = document.querySelectorAll('input[name="edit-filed"]:checked');
    // send fields array to the UI form render function
    renderEditProductForm(newFieldsArray, selectFiledSubmitBtn.dataset.editId);
    selectEditFieldsModal.close();
})

// ===================== FULL EDIT THE PRODUCT BUTTON LOGIC =======================
fullEditBtn.addEventListener('click', () => { // if the user wants to full edit the product
    const selectForm = document.getElementById('select_edit_fields_form');
    const selectedFields = selectForm.querySelectorAll('input[name="edit-filed"]');
    const filedArray = Array.from(selectedFields);
    // send fields array to the UI form render function
    renderEditProductForm(filedArray, fullEditBtn.dataset.editId);
    selectEditFieldsModal.close();
})

// ======================== BUTTON TO CLOSE THE SELECT FIELDS MODAL ============================  
const closeSelectFieldModalBtn = selectEditFieldsModal.querySelector('.close-modal');
closeSelectFieldModalBtn.addEventListener('click', () => {
    selectEditFieldsModal.close();
    state.current_product_edit_id = '';
});

// ====================================== EDIT PRODUCT FROM VALIDATION TRIGGER LOGIC ========================================\
const editProductFromContainer = document.getElementById('edit_product_form_container');
const editProductForm = document.getElementById('edit_product_form');
editProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataObject = validateFrom(editProductFromContainer);
    if (!dataObject) return;
    postDataController({ data: dataObject, isDataEdited: true });
})

// ================================= DELETE THE PRODUCT LOGIC =================================
const deleteConfirmationModal = document.getElementById('delete_confirmation_modal');
const product_namePreviewEl = deleteConfirmationModal.querySelector('.product-name-preview');
const conformDeleteBtn = deleteConfirmationModal.querySelector('.confirm-delete-btn')
const closeDeleteModal = deleteConfirmationModal.querySelector('.cancel-btn')
productContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete_product_btn');
    if (!e.target.className.includes('delete_product_btn') && (!e.target.parentElement.className.includes('delete_product_btn') && !e.target.className.includes('ri-delete-bin-line'))) return;
    const productInfo = state.allProducts.find(product => product.id === btn.dataset.deleteId)
    const productName = productInfo.title;
    product_namePreviewEl.textContent = productName;

    const productId = productInfo.id;
    conformDeleteBtn.dataset.deleteId = productId;
    deleteConfirmationModal.showModal();
})

closeDeleteModal.addEventListener('click', () => { deleteConfirmationModal.close(); })
conformDeleteBtn.addEventListener('click', () => {
    const dataId = conformDeleteBtn.dataset.deleteId;
    deleteData(dataId)
    deleteConfirmationModal.close();
})

// ====================================== PRODUCT IMAGE DRAG AND DROP LOGIC FOR ADD & EDIT PRODUCT FORMS ========================================
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

addProductImageDropArea.addEventListener('dragover', (e) => { e.preventDefault() });
addProductImageDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    addProductImageInput.files = e.dataTransfer.files;
    addProductImageSuccessElement.classList.remove('hidden')
    addProductImageSuccessElement.querySelector('span').textContent = addProductImageInput.files[0].name;
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

editProductImageDropArea.addEventListener('dragover', (e) => { e.preventDefault() });
editProductImageDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    editProductImageInput.files = e.dataTransfer.files;
    editProductImageSuccessElement.classList.remove('hidden')
    editProductImageSuccessElement.querySelector('span').textContent = editProductImageInput.files[0].name;
});

const discardBtn = document.querySelectorAll('.form-discard-btn'); // when the user clicks on discard button to clear the form.
discardBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        restFrom(addProductFrom);
        restFrom(document.getElementById('edit_product_form'));
        state.current_product_edit_id = '';
    })
})

// ====================================== CLOSE SUCCESS & ERROR STATES OF FORM LOGIC ======================================\
const formLoadingModal = document.getElementById('form_loading_modal');
const formSuccessModal = document.getElementById('form_success_modal');
const formErrorModal = document.getElementById('form_error_modal');

const closeModalButtons = document.querySelectorAll('.modal-close');
closeModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const parentElm = e.target.parentElement.parentElement;
        parentElm.close();
        if (parentElm.id === 'delete_confirmation_modal') return;
        formSuccessModal.querySelector('.upload-msg small').innerHTML = 'product data has been uploaded <br>successfully';
        formLoadingModal.querySelector('.upload-msg').innerHTML = 'UploadIng product data <br> to the server...';
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