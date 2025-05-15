import Card from "../../../../../../components/card/index.jsx";
import BarChart from "../../../../../../components/charts/BarChart.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {barChartOptionsWeekly} from "../variable.js";

const WeeklyLike = ({analytics}) => {
    const {t, i18n} = useTranslation();

    const [chartOption, setChartOption] = useState(barChartOptionsWeekly);
    const [chartData, setChartData] = useState([]);

    const getDaysFromNow = () => {
        const days = t("days", {returnObjects: true}).map((item) => item.toUpperCase());
        const currentDay = new Date().getDay();
        const result = [];
        for (let i = 0; i < days.length; i++) {
            const index = (currentDay + i) % days.length;
            result.push(days[index]);
        }
        return result;
    }

    const chartColors = ["#6AD2Fa", "#4318FF", "#EFF4FB"];

    useEffect(() => {
        const data = [];
        analytics.map((item, i) => {
            data.push({
                ...item,
                color: chartColors[i]
            })
        })
        setChartData(data);
    }, [analytics]);

    useEffect(() => {
        setChartOption((prevState) => ({
            ...prevState,
            xaxis: {
                ...prevState.xaxis,
                categories: getDaysFromNow(),
            },
        }));
    }, [i18n.language]);

    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6 pt-2">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    {t("weeklyMostLikedContents")}
                </h2>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[250px] w-full xl:h-[350px]">
                    <BarChart
                        series={chartData}
                        options={chartOption}
                    />
                </div>
            </div>
        </Card>
    );
};

export default WeeklyLike;