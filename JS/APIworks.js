export { fetchData, postData, uploadToCloudinary, deleteData };
import { isUiLoading, isFormLoading, restFrom, reFreshPage, isDeleteModalLoading } from "./utils";
import { state } from "./controller.js";

const fetchData = async (url) => {
    let FetchUrl;

    if (!url) {
        FetchUrl = `https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products`;
    } else {
        FetchUrl = url;
    }

    state.Loading = true;
    isUiLoading();

    try {
        const res = await fetch(FetchUrl, {
            headers: {
                'content-type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            state.allProducts = [];
            data.forEach(el => {
                state.allProducts.push(el);
            });
            return data;
        }

        throw new Error('Something went wrong while fetching the data in Fetch data function');

    } catch (error) {
        console.log(error);
        state.Loading = 'error';
        isUiLoading();
    } finally {
        state.Loading = false;
        isUiLoading();
    }

}


const uploadToCloudinary = async (file) => {
    const imgFile = file;
    let URL;

    const data = new FormData;
    data.append('file', imgFile);
    data.append('upload_preset', 'upload_preset_for_Cloudinary');
    data.append('cloud_name', 'bunnur7c');

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/bunnur7c/image/upload`,
            {
                method: 'POST',
                body: data
            }
        )

        if (!res.ok) {
            URL = false;
            return;
        }

        const HostedImageData = await res.json();
        URL = HostedImageData.url;

    } catch (error) {
        console.log(error)
        URL = false;
    }

    return URL;
}

const postData = async ({ dataObject, method, dataId }) => {
    // console.log(dataObject)
    if (!method && !dataId) {
        // state.FromLoading = true;
        // isFormLoading();

        try {
            const res = await fetch('https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataObject)
            })

            if (!res.ok) {
                state.FromLoading = false;
                isFormLoading();
                restFrom(document.getElementById('add_product_form'))
                return;
            }

            const data = await res.json();
            // console.log(data);
            restFrom(document.getElementById('add_product_form'));

            state.FromLoading = 'success';
            isFormLoading();
            reFreshPage();

        } catch (error) {
            state.FromLoading = false;
            isFormLoading();
            restFrom(document.getElementById('add_product_form'))
        }
    }

    if (dataObject && method && dataId) {
        try {
            const res = await fetch(`https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/${dataId}`, {
                method: `${method}`,
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataObject)
            })

            if (!res.ok) {
                state.FromLoading = false;
                isFormLoading();
                restFrom(document.getElementById('edit_product_form'))
                return;
            }

            const data = await res.json();
            // console.log(data);
            restFrom(document.getElementById('edit_product_form'));

            state.FromLoading = 'success';
            isFormLoading();
            reFreshPage();

        } catch (error) {
            state.FromLoading = false;
            isFormLoading();
            restFrom(document.getElementById('edit_product_form'))
        }
    }
}

const deleteData = async (dataId) => {
    state.deleteModalLoading = true;
    isDeleteModalLoading();
    try {
        const res = await fetch(`https://6a50c67ec576c846dcb9db29.mockapi.io/SiddsOwnRestApi/products/${dataId}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            state.deleteModalLoading = false;
            isDeleteModalLoading();
            return;
        }

        const data = await res.json();
        // console.log(data);

        state.deleteModalLoading = 'success';
        isDeleteModalLoading();
        reFreshPage();

    } catch (error) {
        state.deleteModalLoading = false;
        isDeleteModalLoading();
    }
}