export const sampleWeeklyResponse = [
    {
        name: "CONTENT A",
        views: [400, 370, 330, 390, 320, 350, 360],
        likes: [400, 370, 330, 390, 320, 350, 360]
    },
    {
        name: "CONTENT B",
        views: [400, 370, 330, 390, 320, 350, 360],
        likes: [400, 370, 330, 390, 320, 350, 360]
    },
    {
        name: "CONTENT C",
        views: [400, 370, 330, 390, 320, 350, 360],
        likes: [400, 370, 330, 390, 320, 350, 360]
    },
]

export const barChartOptionsWeekly = {
    chart: {
        stacked: true,
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "#000000"
        },
        theme: 'dark',
        onDatasetHover: {
            style: {
                fontSize: "12px",
                fontFamily: undefined,
            },
        },
    },
    xaxis: {
        categories: [],
        show: false,
        labels: {
            show: true,
            style: {
                colors: "#A3AED0",
                fontSize: "14px",
                fontWeight: "500",
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        show: false,
        color: "black",
        labels: {
            show: false,
            style: {
                colors: "#A3AED0",
                fontSize: "14px",
                fontWeight: "500",
            },
        },
    },
    grid: {
        borderColor: "rgba(163, 174, 208, 0.3)",
        show: true,
        yaxis: {
            lines: {
                show: false,
                opacity: 0.5,
            },
        },
        row: {
            opacity: 0.5,
        },
        xaxis: {
            lines: {
                show: false,
            },
        },
    },
    fill: {
        type: "solid",
        colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    },
    legend: {
        show: false,
    },
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            columnWidth: "20px",
        },
    },
};