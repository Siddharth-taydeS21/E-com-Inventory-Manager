export { state, fetchDataController, searchController, postDataController };
import { renderData } from "./UIworks.js";
import { fetchData, postData, uploadToCloudinary } from "./APIworks.js";
import { isUiLoading, calculateDiscountPercentage, isFormLoading, restFrom } from "./utils.js";

const state = {
    Loading: false,
    allProducts: [],
    FromLoading: false,
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

const postDataController = async (data) => {
    console.log(data);
    const imageFile = data.product_image;
    //title, category, image_url, brand, ratings, rating_count, price, discounted_price, discount_percentage, stock, estimated_delivery_time, is_featured, search_tags;
    const newObject = {};
    newObject.title = data.product_name;
    newObject.category = data.product_category;
    newObject.brand = data.brand_name;
    newObject.ratings = data.product_ratings_in_decimal;
    newObject.rating_count = data.product_ratings_count;
    newObject.price = Number(data.product_price);
    newObject.discounted_price = Number(data.product_discounted_price);
    newObject.discount_percentage = calculateDiscountPercentage(data.product_price, data.product_discounted_price);
    newObject.stock = data.product_stock;
    newObject.estimated_delivery_time = data.product_delivery_time;
    newObject.is_featured = false;
    newObject.search_tags = data.product_tags.split(',').map(tag => tag.trim());

    state.FromLoading = true;
    isFormLoading();

    const imgUrl = await uploadToCloudinary(imageFile);
    if (!imgUrl){
        state.FromLoading = false; // set error state and show error ui
        isFormLoading(); 

        restFrom(document.getElementById('add_product_form')); //reset forms
        console.log('error cause is image upload')
        return;
    }

    newObject.image_url = imgUrl;
    postData(newObject);
}