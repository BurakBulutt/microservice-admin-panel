import {useTranslation} from "react-i18next";
import Card from "../../../../../components/card/index.jsx";
import {MdArrowDropUp} from "react-icons/md";
import BarChart from "../../../../../components/charts/BarChart.jsx";
import {useEffect, useState} from "react";
import {sampleDailyTrafficResponse,barChartOptionsDailyTraffic} from "./variable.js";

const DailyTraffic = () => {
    const {t,i18n} = useTranslation();
    const [analytics,setAnalytics] = useState(null);
    const [chartData,setChartData] = useState([]);

    const getAnalytics = () => {
        //TODO API CALL IS HERE
        setAnalytics(sampleDailyTrafficResponse);
    }

    useEffect(() => {
        getAnalytics()
    }, []);

    useEffect(() => {
        if (analytics) {
            setChartData(Array.of({
                name : t("dailyTraffic"),
                data : analytics.data
            }));
        }
    }, [analytics,i18n.language]);

    return (
        <Card extra="pb-7 p-[20px]">
            <div className="flex flex-row justify-between">
                <div className="ml-1 pt-2">
                    <p className="text-sm font-medium leading-4 text-gray-600">
                        {t("dailyTraffic")}
                    </p>
                    <p className="text-[34px] font-bold text-navy-700 dark:text-white">
                        {analytics?.totalVisitors}{" "}
                        <span className="text-sm font-medium leading-6 text-gray-600">
              {t("visitors")}
            </span>
                    </p>
                </div>
                <div className="mt-2 flex items-start">
                    <div className="flex items-center text-sm text-green-500">
                        <MdArrowDropUp className="h-5 w-5" />
                        <p className="font-bold"> +{analytics?.increaseRate}% </p>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full pt-10 pb-0">
                <BarChart
                    series={chartData}
                    options={barChartOptionsDailyTraffic}
                />
            </div>
        </Card>
    );
};

export default DailyTraffic;
