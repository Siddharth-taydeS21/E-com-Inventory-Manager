export { fetchData };
import { isUiLoading, renderData } from "./UIworks.js";
import { state } from "./controller.js";

const fetchData =  async (url) => {
    let FetchUrl;

    if (!url) {
        FetchUrl = `https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products`;
    }else{
        FetchUrl = url;
    }

    state.Loading = true;
    isUiLoading(); 

    try {
        const res = await fetch(FetchUrl, {
                headers:{
                    'content-type': 'application/json'
                }
        });

        if (res.ok) {
            const data = await res.json();
            renderData(data);
        }

        throw new Error('Something went wrong while fetching the data in Fetch data function');

    } catch (error) {
        console.log(error);
    }finally{
        state.Loading = false;
        isUiLoading(); 
    }

}