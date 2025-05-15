import Card from "../../../../components/card/index.jsx";
import {MdBarChart} from "react-icons/md";
import BarChart from "../../../../components/charts/BarChart.jsx";
import {barChartDataWeeklyRevenue, barChartOptionsWeeklyRevenue} from "../variables/charts.js";

const WeeklyRevenue = () => {
  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6 pt-2">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Weekly Revenue
        </h2>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <BarChart
            series={barChartDataWeeklyRevenue}
            options={barChartOptionsWeeklyRevenue}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;
