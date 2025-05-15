import Chart from 'react-apexcharts';

const BarChart = (props) => {
    const {series, options} = props;

    return (
        <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="100%"
        />
    );
}

export default BarChart;
