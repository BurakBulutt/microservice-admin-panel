import Card from "../../../../components/card/index.jsx";
import PieChart from "../../../../components/charts/PieChart.jsx";
import {pieChartData, pieChartOptions} from "../variables/charts.js";


const PieChartCard = () => {
  return (
    <Card extra="rounded-[20px] pt-3 pr-3 pl-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            S3 Storage
          </h4>
        </div>
      </div>

      <div className="mb-auto mt-6 flex h-[220px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 mb-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Usage</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            63%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Empty</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            37%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
