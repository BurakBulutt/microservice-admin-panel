import Card from "../../../../../components/card/index.jsx";
import PieChart from "../../../../../components/charts/PieChart.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

import {pieChartOptionsS3Storage, sampleS3StorageResponse} from "./variable.js";

const S3StorageChart = () => {
    const {t,i18n} = useTranslation();

    const [analytics,setAnalytics] = useState(null);
    const [chartOption,setChartOption] = useState(pieChartOptionsS3Storage);
    const [chartData,setChartData] = useState([]);

    const getAnalytics = () => {
        //TODO API CALL IS HERE
        setAnalytics(sampleS3StorageResponse);
    }

    useEffect(() => {
        setChartOption((prevState) => ({
            ...prevState,
            labels: [t("usage"),t("empty")]
        }));
    }, [i18n.language]);

    useEffect(() => {
        getAnalytics()
    }, []);

    useEffect(() => {
        if (analytics) {
            setChartData(analytics);
        }
    }, [analytics]);

    return (
        <Card extra="rounded-[20px] pt-3 pr-3 pl-3">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        {t("s3Storage")}
                    </h4>
                </div>
            </div>

            <div className="mb-auto mt-6 flex h-[220px] w-full items-center justify-center">
                <PieChart options={chartOption} series={chartData} />
            </div>
            <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 mb-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-brand-500" />
                        <p className="ml-1 text-sm font-normal text-gray-600">{t("usage")}</p>
                    </div>
                    <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
                        {chartData[0]}%
                    </p>
                </div>

                <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
                        <p className="ml-1 text-sm font-normal text-gray-600">{t("empty")}</p>
                    </div>
                    <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
                        {chartData[1]}%
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default S3StorageChart;