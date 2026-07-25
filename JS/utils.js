export { isUiLoading, debounce, removeErrorUis, removeActiveClasses, showErrorMsg, showSuccessMsg, reSetSuccessUi, reSetErrorUi, calculateDiscountPercentage, isFormLoading, restFrom, reFreshPage, resetEditForm, isDeleteModalLoading };
import { state, fetchDataController } from "./controller.js";

const productsSection = document.getElementById('products');
const MainContainer = productsSection.querySelector('.container');
const productsCardsContainer = document.querySelector('.products_container');
const categoryDetailsElement = document.querySelector('.category_details');
const loadingProductCardTemplate = document.getElementById('loading_product_card_template');
const notFoundErrorTemplate = document.getElementById('not_found_template');
const ErrorTemplate = document.getElementById('Error_template')

// ============ SMALL HELPER FUNCTION FOR REMOVING PREVIOUS ERROR UI CARDS FORM THE UI ============
const removeErrorUis = () => {
    const errorCards = document.querySelectorAll('#error');
    errorCards.forEach(card => {
        if (card) {
            card.remove();
        }
    })
}

// ============ SMALL HELPER FUNCTION FOR REMOVING ANIMATED ACTIVE CLASSES FORM NAV BAR LINKS ============
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
    if (state.Loading === true) {
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
    } else if (state.Loading === 'not-found') {
        //if container already has previous error cards
        removeErrorUis();

        const errorCard = notFoundErrorTemplate.content.cloneNode(true);
        const searchInput = document.getElementById('search-input');
        errorCard.querySelector('.keyWord').textContent = searchInput.value;

        MainContainer.append(errorCard);
        document.getElementById('product_count').textContent = '...';
        document.getElementById('category').textContent = 'No Products';
    }
    else if (state.Loading === 'error') {
        //if container already has previous error cards
        removeErrorUis();

        MainContainer.append(
            ErrorTemplate.content.cloneNode(true)
        )
    }
    else if (state.Loading === false) {
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

// =========================== (SHOW ERROR & SUCCESS MASSAGE + UI ON INPUT FIELDS) HELPER FUNCTION FOR FORM VALIDATION ============================
const reSetSuccessUi = (el) => {
    if (el.className.includes('border-green-300')) {
        el.classList.replace('border-green-300', 'border-gray-300');
    }
    const successIcon = el.querySelector('.success-icon');
    if (!successIcon.className.includes('hidden')) {
        successIcon.classList.add('hidden');
    }
}

const reSetErrorUi = (el) => {
    if (el.className.includes('border-red-300')) {
        el.classList.replace('border-red-300', 'border-gray-300');
    }
    const errorIcon = el.querySelector('.error-icon');
    if (!errorIcon.className.includes('hidden')) {
        errorIcon.classList.add('hidden');
    }
    const errorMassage = el.querySelector('.error-msg');
    if (!errorMassage.className.includes('hidden')) {
        errorMassage.textContent = '';
        errorMassage.classList.add('hidden');
    }
}

const showErrorMsg = (el, massage) => {
    // if there was success UI then remove it first
    reSetSuccessUi(el);

    el.classList.replace('border-gray-300', 'border-red-300');

    const errorIcon = el.querySelector('.error-icon');
    if (errorIcon.className.includes('hidden')) {
        errorIcon.classList.remove('hidden');
    }

    const errorMassage = el.querySelector('.error-msg');
    errorMassage.textContent = massage;
    if (errorMassage.className.includes('hidden')) {
        errorMassage.classList.remove('hidden');
    }
    el.scrollIntoView({ behavior: "smooth" })
}

const showSuccessMsg = (el) => {
    // if there was error UI then remove it first
    reSetErrorUi(el);

    el.classList.replace('border-gray-300', 'border-green-300');
    const successIcon = el.querySelector('.success-icon');
    if (successIcon.className.includes('hidden')) {
        successIcon.classList.remove('hidden');
    };
}

// // =========================== CALCULATE DISCOUNT PERCENTAGE FROM 2 PRICES - (HELPER FUNCTION) ============================
function calculateDiscountPercentage(originalPrice, salePrice) {
    const wholePercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    // Round to 2 decimal places and convert back to a number
    return wholePercentage;
}

//===================================== RESET FORMS HELPER FUNCTION ===========================================
const restFrom = (form) => {
    const successMsgElem = form.querySelector('.success-elem');
    const massage = successMsgElem.querySelector('.selected_img_file');
    massage.textContent = '';
    successMsgElem.classList.add('hidden');
    const allInputs = form.querySelectorAll('.form-control');
    allInputs.forEach(input => {
        reSetErrorUi(input);
        reSetSuccessUi(input);
    })

    document.querySelectorAll('form').forEach(formEl => formEl.reset())
}

// =========================== FORM LOADING/ERROR/SUCCESS STATES UI FUNCTION ============================
const formLoadingModal = document.getElementById('form_loading_modal');
const formSuccessModal = document.getElementById('form_success_modal');
const formErrorModal = document.getElementById('form_error_modal');
const isFormLoading = () => {   
    if(state.FromLoading === true){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close())
        formLoadingModal.showModal();
        // console.log('loading...')
    }else if(!state.FromLoading){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close())
        formErrorModal.showModal();
        // console.log('error...!')
    }else if(state.FromLoading === 'success'){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close())
        formSuccessModal.showModal();
        // console.log('success...!')
    }
}

//// =========================== DELETE PRODUCT LOADING/ERROR/SUCCESS STATES UI FUNCTION ============================
const deleteModalLoader = document.querySelector('.delete-modal-loader');
const isDeleteModalLoading = () => {
    if(state.deleteModalLoading === true){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close());
        deleteModalLoader.showModal();
    }
    else if(!state.deleteModalLoading){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close());
        formErrorModal.showModal();
    }
    else if(state.deleteModalLoading === 'success'){
        document.querySelectorAll('.form-state-popup').forEach(popup => popup.close());
        formSuccessModal.querySelector('.upload-msg small').textContent = 'Product data hs been deleted.'
        formSuccessModal.showModal();
    }
}

// ===================================== REFRESH PAGE WITH NEW PRODUCTS HELPER FUNCTION ==================================
const reFreshPage = () => {
    const productsCardsContainer = document.querySelector('.products_container').innerHTML = '';
    removeActiveClasses();
    fetchDataController('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products');
}

// =================================  RESET EDIT FORM IF USER CLOSES IT AFTER SOME CHANGES ======================================
const resetEditForm = (form) => {
    const allInputs = form.querySelectorAll('.form-control');
    allInputs.forEach(input => input.classList.add('hidden'));
    allInputs.forEach(input => {
        if(input.id === 'product_searchTags_field') return;
        input.classList.add('mb-15')
    });

    const allInputFields = form.querySelectorAll('.input-field');
    allInputFields.forEach(inputFiled => {
        if(!inputFiled.className.includes('md:grid-cols-2')){
            if(inputFiled.className.includes('search_tags_field')) return;
            inputFiled.classList.add('md:grid-cols-2');
        }
    })
}