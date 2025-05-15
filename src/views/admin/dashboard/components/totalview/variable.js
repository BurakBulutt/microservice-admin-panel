export const lineChartOptionsTotalView = {
    legend: {
        show: false,
    },
    chart: {
        toolbar: {
            show: false,
        }
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
    },
    tooltip: {
        style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "#000000"
        },
        theme: 'dark',
        x: {
            format: "dd/MM/yy HH:mm",
        },
    },
    grid: {
        show: false,
    },
    xaxis: {
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            style: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500",
            },
        },
        type: "text",
        range: undefined,
        categories: []
    },

    yaxis: {
        show: false,
    },
};

export const sampleWeeklyResponse = {
    totalView: 12345,
    increaseRate: 1.5,
    data : [
        {
            view: 10,
            like : 69,
            dislike : 78
        },
        {
            view: 20,
            like : 89,
            dislike : 31
        },
        {
            view: 30,
            like : 49,
            dislike : 24
        },
        {
            view: 40,
            like : 59,
            dislike : 7
        },
        {
            view: 50,
            like : 69,
            dislike : 4
        },
        {
            view: 70,
            like : 190,
            dislike : 5
        },
        {
            view: 90,
            like : 119,
            dislike : 10
        }
    ]
}

export const sampleMonthlyResponse = {
    totalView: 34500,
    increaseRate: 11,
    data : [
        {
            view: 40,
            like : 59,
            dislike : 7
        },
        {
            view: 10,
            like : 69,
            dislike : 78
        },
    ]
}

export const sampleYearlyResponse = {
    totalView: 56779,
    increaseRate: 47,
    data : [
        {
            view: 10,
            like : 69,
            dislike : 78
        },
        {
            view: 20,
            like : 89,
            dislike : 31
        },
        {
            view: 30,
            like : 49,
            dislike : 24
        },
        {
            view: 40,
            like : 59,
            dislike : 7
        },
        {
            view: 50,
            like : 69,
            dislike : 4
        }
    ]
}