
const getData = async () => {

    let array;
    await fetch(
        await getUrl() + "/getDaily",
        {
            method: 'post',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "startDate": "2023-06-22",
                "endDate": "2023-06-30",
            }),
        }
    ).then(response => {
        return response.json();
    }).then(function (data) {
        array = data;
        array.sort(function (a, b) {
            return b.Avg - a.Avg
        })
    });
    return array;
}


const createGraph = async () => {
    let arr = await getData();
    let data = {
        labels: ['min', 'avg', 'max'],
        datasets: [],
    };

    for (let i = 10; i < 17; i++) {
        let item = {
            label: arr[i].ExchangeId,
            data: [arr[i].Min, arr[i].Avg, arr[i].Max],
            backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#cc65fe',
                '#ffce56',
            ],
        }
        data.datasets.push(item);

    }
    console.log(data)
    return data;
}

const draw = async () => {
    let arr = await createGraph();

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: arr,
        options: {
            plugins: {
                colors: {
                    enabled: false
                }
            }
        }
    });
}