const ctx = document.getElementById('result#0');
let labels = []
let probdata = []
let allprobdata = [];

chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: '獲得数が目標数に満たない確率',
            data: probdata,
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'logarithmic',
                beginAtZero: true
            }
        }
    }
});

function k_times_success(trynum, successnum, prob) {
    if (trynum < successnum) {
        return 0
    }
    let result = math.combinations(trynum, successnum) * (prob ** successnum) * ((1 - prob) ** (trynum - successnum));
    return result
}

function calcullate_prob(trynum, successnum, prob) {
    let sum = 0;
    for (let k = 0; k < successnum; k++) {
        sum += k_times_success(trynum, k, prob);
    }
    return sum
}

function create_data(successnum, prob) {
    let successprob = 1;
    for (let trynum = 1; successprob > 0.001; trynum = trynum * 2) {
        successprob = calcullate_prob(trynum, successnum, prob);
        labels.push(trynum);
        probdata.push(successprob);
        chart.update()
    }
}

function get_successnum() {
    num = document.getElementById("target_num#0").value;
    return num;
}

function get_prob() {
    prob = document.getElementById("probability#0").value;
    return prob / 100;
}

function calc_button() {
    chart.clear();
    labels.length = 0;
    probdata.length = 0;
    allprobdata.length = 0;
    num = get_successnum();
    prob = get_prob();
    create_data(num, prob);
    calc_all(num, prob, 0.999);
    change_text();
}

function calc_all(successnum, prob, target_prob) {
    let trynum = 1;
    let successprob = 1;
    for (; successprob > 1 - target_prob; trynum = trynum + 1) {
        successprob = calcullate_prob(trynum, successnum, prob);
        allprobdata.push(successprob)
    }
    return trynum;
}

function change_text() {
    let NNflag = false;
    for (let index = 0; index < allprobdata.length; index++) {
        const element = allprobdata[index];
        if (!NNflag && element < 0.01) {
            document.getElementById("NN#1").textContent = index + 1;
            NNflag = true;
        }
        if (element < 0.001) {
            document.getElementById("NNN#1").textContent = index + 1;
        }
    }
}

document.getElementById("calculate_button#0").addEventListener("click", calc_button, false)