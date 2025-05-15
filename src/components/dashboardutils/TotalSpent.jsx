import Card from "../../../../components/card/index.jsx";
import {
  MdArrowDropUp,
  MdBarChart,
  MdOutlineCalendarToday,
} from "react-icons/md";
import LineChart from "../../../../components/charts/LineChart.jsx";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "../variables/charts.js";

const TotalSpent = () => {
  return (
    <Card extra="!p-[30px] text-center">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Total Spent
        </h2>
        <div className="flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-navy-700 dark:text-white">
            $37.5K
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-gray-600">Total Spent</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +2.45% </p>
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <LineChart
            options={lineChartOptionsTotalSpent}
            series={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
