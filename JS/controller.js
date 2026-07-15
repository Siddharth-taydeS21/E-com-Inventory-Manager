export { state, fetchDataController, searchController };
import { renderData } from "./UIworks.js";
import { fetchData } from "./APIworks.js";
import { isUiLoading } from "./utils.js";

const state = {
    Loading: false,
    allProducts: [],
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