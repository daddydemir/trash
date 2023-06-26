

const getUrl = async () => {

    return fetch('config.json')
        .then(response => response.json())
        .then(data => {
            return data.urls.prod;
        })
}