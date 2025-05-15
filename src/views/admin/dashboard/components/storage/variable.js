export const sampleS3StorageResponse = [63, 37];

export const pieChartOptionsS3Storage = {
    labels: [],
    colors: ["#4318FF", "#6AD2FF"],
    chart: {
        width: "50px",
    },
    states: {
        hover: {
            filter: {
                type: "none",
            },
        },
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
        donut: {
            expandOnClick: false,
            donut: {
                labels: {
                    show: false,
                },
            },
        },
    },
    fill: {
        colors: ["#4318FF", "#6AD2FF"],
    },
    tooltip: {
        enabled: true,
        theme: "dark",
        style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "#000000"
        },
    },
};