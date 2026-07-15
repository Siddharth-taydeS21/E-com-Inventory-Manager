export { state, fetchDataController };
import { renderData } from "./UIworks.js";
import { fetchData } from "./APIworks.js";

const state = {
    Loading: false,
}

const fetchDataController = async (url) => {
    const data = await fetchData(url);
    renderData(data);
}