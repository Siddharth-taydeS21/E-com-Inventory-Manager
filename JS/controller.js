export { state, fetchDataController, searchController, postDataController };
import { renderData } from "./UIworks.js";
import { fetchData, postData, uploadToCloudinary } from "./APIworks.js";
import { isUiLoading, calculateDiscountPercentage, isFormLoading, restFrom } from "./utils.js";

const state = {
    Loading: false,
    FromLoading: false,
    deleteModalLoading: false,
    allProducts: [],
    current_product_edit_id: ''
}

const fetchDataController = async (url) => {
    const data = await fetchData(url);
    renderData(data);
}

const searchController = (data) => {
    if (data.length === 0) {
        state.Loading = 'not-found';
        isUiLoading();
        return;
    }
    renderData(data);
}

const postDataController = async ({ data, isDataEdited }) => {
    // console.log(data);
    //title, category, image_url, brand, ratings, rating_count, price, discounted_price, discount_percentage, stock, estimated_delivery_time, is_featured, search_tags;
    const newObject = {};
    // id data.xyz filed is = ""; then return or newObject.xyzKey = data.xyz;
    if (data.product_name || !data.product_name === '') {
        newObject.title = data.product_name;
    }
    if (data.brand_name || !data.brand_name === '') {
        newObject.brand = data.brand_name;
    }
    if (data.product_category || !data.product_category === '') {
        newObject.category = data.product_category;
    }
    if (data.product_ratings_in_decimal || !data.product_ratings_in_decimal === '') {
        newObject.ratings = data.product_ratings_in_decimal;
    }
    if (data.product_ratings_count || !data.product_ratings_count === '') {
        newObject.rating_count = data.product_ratings_count;
    }
    if (data.product_price || !data.product_price === '') {
        newObject.price = Number(data.product_price);
    }
    if (data.product_discounted_price || !data.product_discounted_price === '') {
        newObject.discounted_price = Number(data.product_discounted_price);
    }
    if (data.product_price && data.product_discounted_price) {
        newObject.discount_percentage = calculateDiscountPercentage(data.product_price, data.product_discounted_price);
    }
    if (data.product_stock || !data.product_stock === '') {
        newObject.stock = data.product_stock;
    }
    if (data.product_delivery_time || !data.product_delivery_time === '') {
        newObject.estimated_delivery_time = data.product_delivery_time;
    }
    newObject.is_featured = false;
    if (data.product_tags || !data.product_tags === '') {
        newObject.search_tags = data.product_tags.split(',').map(tag => tag.trim());
    }

    state.FromLoading = true;
    isFormLoading();

    if (data.product_image && data.product_image.name !== '' && data.product_image.size !== 0) {
        const imageFile = data.product_image;
        const imgUrl = await uploadToCloudinary(imageFile);
        if (!imgUrl){
            state.FromLoading = false; // set error state and show error ui
            isFormLoading(); 

            restFrom(document.getElementById('add_product_form')); //reset forms
            return;
        }
        newObject.image_url = imgUrl;
    }

    if (!isDataEdited) {
        postData({ dataObject: newObject }); // Method will be POST 
    } else {
        const length = Object.keys(newObject).length;
        if (length < 13) {
            postData({ dataObject: newObject, method: 'PUT', dataId: state.current_product_edit_id });
        } else if (length === 13) {
            postData({ dataObject: newObject, method: 'PUT', dataId: state.current_product_edit_id });
        }
    }
}