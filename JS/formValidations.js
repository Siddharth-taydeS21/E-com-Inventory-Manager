export { validateFrom };
import { showErrorMsg, showSuccessMsg } from "./utils.js";

// ===================================== PRIMARY FORM VALIDATION FUNCTION FOR FORMS ====================================
const validateFrom = (FormContainer) => {
    // ========= SELECTING ALL INPUTS TO VALIDATE FIRST ==========
    const productNameInput = FormContainer.querySelector('#product_name');
    const brandNameInput = FormContainer.querySelector('#brand_name');
    const imageInput = FormContainer.querySelector('input[type="file"]');
    const categoryInputs = FormContainer.querySelectorAll('#product_category');
    const ratingsInput = FormContainer.querySelector('#product_ratings_in_decimal');
    const ratingsCountInput = FormContainer.querySelector('#product_ratings_count');
    const priceInput = FormContainer.querySelector('#product_price');
    const discountedPriceInput = FormContainer.querySelector('#product_discounted_price');
    const stockInput = FormContainer.querySelector('#product_stock');
    const deliveryTimeInput = FormContainer.querySelector('#product_delivery_time');
    const tagsInput = FormContainer.querySelector('#product_tags');

    let IsFormValid = true;

    let validateProductName = true;
    let validateBrand = true;
    let validateImage = true;
    let validateCategory = true;
    let validateRatings = true;
    let validateRatingsCount = true;
    let validatePrice = true;
    let validateDiscountedPrice = true;
    let validateStock = true;
    let validateDeliveryTime = true;
    let validateTags = true;

    //product Name validation 
    if (!productNameInput.parentElement.className.includes('hidden')) {
        if (productNameInput.value.trim() === '') {
            showErrorMsg(productNameInput.parentElement, 'Product name can not be empty');
            validateProductName = false;
        } else if (productNameInput.value.trim().length < 3) {
            showErrorMsg(productNameInput.parentElement, 'Product name must have more than 3 letters');
            validateProductName = false;
        } else {
            showSuccessMsg(productNameInput.parentElement);
            validateProductName = true;
        }
    }

    //brand Name validation
    if (!brandNameInput.parentElement.className.includes('hidden')) {
        if (brandNameInput.value.trim() === '') {
            showErrorMsg(brandNameInput.parentElement, 'Brand name can not be empty');
            validateBrand = false;
        } else if (brandNameInput.value.trim().length < 3) {
            showErrorMsg(brandNameInput.parentElement, 'Brand name must have more than 3 letters');
            validateBrand = false;
        } else {
            showSuccessMsg(brandNameInput.parentElement);
            validateBrand = true;
        }
    }

    //Image validation
    const ImageParentElem = imageInput.parentElement;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (!ImageParentElem.parentElement.className.includes('hidden')) {
        if (!imageInput.files || imageInput.files.length === 0) {
            showErrorMsg(ImageParentElem.parentElement, 'Please select an image for your product');
            validateImage = false;
        } else if (!allowedTypes.includes(imageInput.files[0].type)) {
            showErrorMsg(ImageParentElem.parentElement, 'Invalid file type. Only JPG, PNG, WEBP, AVIF and GIF are allowed');
            validateImage = false;
        } else if (imageInput.files[0].size > maxSizeInBytes) {
            showErrorMsg(ImageParentElem.parentElement, 'File is too large. Maximum size allowed is 10MB');
            validateImage = false;
        } else {
            showSuccessMsg(ImageParentElem.parentElement);
            validateImage = true;
        }
    }

    //category validation 
    const categoryParentEl = FormContainer.querySelector('.category_div').parentElement;
    const array = Array.from(categoryInputs);
    const isOneChecked = array.some(el => el.checked);

    if (!categoryParentEl.className.includes('hidden')) {
        if (!isOneChecked) {
            showErrorMsg(categoryParentEl, 'Please select at least 1 Option form Categories');
            validateCategory = false;
        } else {
            showSuccessMsg(categoryParentEl);
            validateCategory = true;
        }
    }

    //product ratings validation
    if (!ratingsInput.parentElement.className.includes('hidden')) {
        if (!ratingsInput.value) {
            showErrorMsg(ratingsInput.parentElement, 'Please select at least 1 Option form Ratings');
            validateRatings = false;
        } else {
            showSuccessMsg(ratingsInput.parentElement);
            validateRatings = true;
        }
    }

    //product ratings (number input) validation
    if (!ratingsCountInput.parentElement.className.includes('hidden')) {
        if (!ratingsCountInput.value || ratingsCountInput.value === "0") {
            showErrorMsg(ratingsCountInput.parentElement, 'Product ratings can not be Empty or Zero');
            validateRatingsCount = false;
        } else {
            showSuccessMsg(ratingsCountInput.parentElement);
            validateRatingsCount = true;
        }
    }

    //price input validation 
    if (!priceInput.parentElement.className.includes('hidden')) {
        if (!priceInput.value || priceInput.value === "0") {
            showErrorMsg(priceInput.parentElement, 'Price can not be Empty or Zero');
            validatePrice = false;
        } else if (priceInput.value < 200) {
            showErrorMsg(priceInput.parentElement, 'Price is too small. Minimum Price allowed is 200.Rs');
            validatePrice = false;
        } else {
            showSuccessMsg(priceInput.parentElement);
            validatePrice = true;
        }
    }

    //discounted price input validation 
    if (!discountedPriceInput.parentElement.className.includes('hidden')) {
        if (!discountedPriceInput.value || discountedPriceInput.value === "0") {
            showErrorMsg(discountedPriceInput.parentElement, 'Discounted price can not be Empty or Zero');
            validateDiscountedPrice = false;
        } else if (discountedPriceInput.value < 100) {
            showErrorMsg(discountedPriceInput.parentElement, 'Price is too small. Minimum Price allowed is 100.Rs');
            validateDiscountedPrice = false;
        } else if (Number(discountedPriceInput.value) > Number(priceInput.value)) {
            showErrorMsg(discountedPriceInput.parentElement, 'Discounted price must be less than current price');
            validateDiscountedPrice = false;
        } else {
            showSuccessMsg(discountedPriceInput.parentElement);
            validateDiscountedPrice = true;
        }
    }

    // product stock input validation 
    if (!stockInput.parentElement.className.includes('hidden')) {
        if (!stockInput.value || stockInput.value === "0") {
            showErrorMsg(stockInput.parentElement, 'Stock count can not be Empty or Zero');
            validateStock = false;
        } else {
            showSuccessMsg(stockInput.parentElement);
            validateStock = true;
        }
    }

    //product Delivery time input validation
    if (!deliveryTimeInput.parentElement.className.includes('hidden')) {
        if (!deliveryTimeInput.value) {
            showErrorMsg(deliveryTimeInput.parentElement, 'Please select at least 1 Option form this field');
            validateDeliveryTime = false;
        } else {
            showSuccessMsg(deliveryTimeInput.parentElement);
            validateDeliveryTime = true;
        }
    }

    //product tags input validation
    const maxSevenRegex = /^\s*[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*(?:\s*,\s*[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*){6,}\s*$/;

    if (!tagsInput.parentElement.className.includes('hidden')) {
        if (maxSevenRegex.test(tagsInput.value)) {
            showSuccessMsg(tagsInput.parentElement);
            validateTags = true;
        } else {
            showErrorMsg(tagsInput.parentElement, 'Please provide at least 7 tags');
            validateTags = false;
        }
    }

    IsFormValid &= validateProductName;
    IsFormValid &= validateBrand;
    IsFormValid &= validateImage;
    IsFormValid &= validateCategory;
    IsFormValid &= validateRatings;
    IsFormValid &= validateRatingsCount;
    IsFormValid &= validatePrice;
    IsFormValid &= validateDiscountedPrice;
    IsFormValid &= validateStock;
    IsFormValid &= validateDeliveryTime;
    IsFormValid &= validateTags;

    if (!IsFormValid) return;

    const form = FormContainer.querySelector('form');
    const formData = new FormData(form);
    const DataObject = Object.fromEntries(formData.entries());
    return DataObject;
}
