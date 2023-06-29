let exchanges = [];
let exchangeMap = {};
let colors = {
    'pink': '#ff6384'
    , 'blue': '#36a2eb'
    , 'purple': '#cc65fe'
    , 'yellow': '#ffce56'
    , 'black': '#000'
}
let days = ['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar'];
let myChart = null;


const refreshExchanges = async () => {
    let btn = document.getElementById('refreshBtn');
    btn.classList.add('fa-spin');
    let array;

    await fetch(
        await getUrl() + "/getExchange",
        {
            method: 'get',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
        }
    ).then(response => {
        return response.json();
    }).then(function (data) {
        array = data;
        exchanges = data;
        normalize(array);
        btn.classList.remove('fa-spin')
    });
    await exchangeCreator(array);

}

const exchangeCreator = async (array) => {
    let select = document.getElementById('exchanges');
    select.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        let o = document.createElement('option');
        o.text = array[i].Name;
        o.value = array[i].ExchangeId;
        select.add(o);
    }

}

const getWeekly = async () => {
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let id = document.getElementById('exchanges').value;
    let out = [];

    startDate = '2023-06-01';
    endDate = '2023-06-30';

    await fetch(
        await getUrl() + '/getDailyWithId',
        {
            method: 'post',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                id: id,
            }),
        },
    ).then(response => {
        return response.json();
    }).then(data => {
        out = data;
    });


    let image = document.getElementById('coin-img');
    image.src = exchangeMap[id].CoinImage;
    let name = document.getElementById('coin-name');
    name.textContent = exchangeMap[id].Name;

    barGraph(out);


}

const normalize = async (array) => {
    for (let i = 0; i < array.length; i++) {
        exchangeMap[array[i].ExchangeId] = array[i];
    }
}


const barGraph = (arr) => {

    let data = {
        labels: days,
        datasets: [],
    };
    let mins = [];
    let maxs = [];
    let avgs = [];
    for (let i = 0; i < arr.length; i++) {
        mins[i] = arr[i].Min;
        maxs[i] = arr[i].Max;
        avgs[i] = arr[i].Avg;
    }

    let min = {
        label: arr[0].ExchangeId + '-min',
        data: mins,
        backgroundColor: [colors['blue']]
    };
    let avg = {
        label: arr[0].ExchangeId + '-avg',
        data: avgs,
        backgroundColor: [colors['pink']],
    };
    let max = {
        label: arr[0].ExchangeId + '-max',
        data: maxs,
        backgroundColor: [colors['yellow']],
    };


    data.datasets.push(min);
    data.datasets.push(avg);
    data.datasets.push(max);
    let canvas = document.getElementById('myChart');
    if (myChart !== null) {
        myChart.destroy();
    }
    //canvas.remove();
    //let div = document.getElementById('div-chart');
    //div.append(`<canvas id="myChart"> </canvas>`);
    //canvas = document.getElementById('myChart');

    var ctx = canvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {}
    });
}