import Card from "../../../../../components/card/index.jsx";
import {MdArrowDropUp} from "react-icons/md";
import LineChart from "../../../../../components/charts/LineChart.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {
    lineChartOptionsTotalView,
    sampleMonthlyResponse,
    sampleWeeklyResponse,
    sampleYearlyResponse
} from "./variable.js";

const TotalView = () => {
    const {t,i18n} = useTranslation();

    const [analytics,setAnalytics] = useState(null);
    const [selectedOption,setSelectedOption] = useState("WEEKLY");
    const [chartOption,setChartOption] = useState(lineChartOptionsTotalView);
    const [chartData,setChartData] = useState([]);

    const getMonthsUntilNow = () => {
        const months = t("months", {returnObjects: true}).map((item) => item.toUpperCase());
        const currentMonth = new Date().getMonth();
        return months.slice(0, currentMonth + 1);
    }

    const getDaysFromNow = () => {
        const days = t("days", {returnObjects: true}).map((item) => item.toUpperCase());
        const currentDay = new Date().getDay();
        const result = [];
        for(let i = 0; i < days.length; i++) {
            const index = (currentDay + i) % days.length;
            result.push(days[index]);
        }
        return result;
    }

    const getAnalytics = (option) => {
        //TODO API CALL IS HERE
        switch (option) {
            case "WEEKLY":
                setAnalytics(sampleWeeklyResponse);
                break;
            case "MONTHLY":
                setAnalytics(sampleMonthlyResponse);
                break;
            case "YEARLY":
                setAnalytics(sampleYearlyResponse);
                break;
            default:
                setAnalytics(sampleWeeklyResponse);
                break;
        }
    }

    const formatNumber = (num) => {
        if (num >= 1_000_000) {
            const value = (num / 1_000_000).toFixed(1);
            return value.endsWith(".0") ? `${parseInt(value)}M` : `${value}M`;
        } else if (num >= 1_000) {
            const value = (num / 1_000).toFixed(1);
            return value.endsWith(".0") ? `${parseInt(value)}K` : `${value}K`;
        } else {
            return num.toString();
        }
    };


    useEffect(() => {
        const date = new Date();
        if (selectedOption === "WEEKLY") {
            setChartOption((prevState) => ({
                ...prevState,
                xaxis: {
                    ...prevState.xaxis,
                    categories: getDaysFromNow(),
                },
            }));
        } else if (selectedOption === "MONTHLY") {
            const months = t("months", {returnObjects: true}).map((item) => item.toUpperCase());
            const currentMonth = date.getMonth();
            setChartOption((prevState) => ({
                ...prevState,
                xaxis: {
                    ...prevState.xaxis,
                    categories: Array.of(months[currentMonth-1],months[currentMonth]),
                },
            }));
        } else if (selectedOption === "YEARLY") {
            setChartOption((prevState) => ({
                ...prevState,
                xaxis: {
                    ...prevState.xaxis,
                    categories: getMonthsUntilNow(),
                },
            }));
        }
        getAnalytics(selectedOption);
    }, [selectedOption,i18n.language]);

    useEffect(() => {
        const views = analytics?.data?.map((item) => item.view);
        const likes = analytics?.data?.map((item) => item.like);
        const dislikes = analytics?.data?.map((item) => item.dislike);

        setChartData([
            {
                name: t("totalView"),
                data: views,
                color: "#4318FF",
            },
            {
                name: t("like"),
                data: likes,
                color: "#6AD2FF",
            },
            {
                name: t("dislike"),
                data: dislikes,
                color: "#EFF4FB",
            },
        ]);
    }, [analytics,i18n.language]);

    return (
        <Card extra="!p-[30px] text-center">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    {t("totalInteraction")}
                </h2>
                <div className="flex items-center justify-center">
                    <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white"
                    onChange={(e) => setSelectedOption(e.target.value)}
                    value={selectedOption}>
                        <option value="WEEKLY">{t("lineOptions.weekly")}</option>
                        <option value="MONTHLY">{t("lineOptions.monthly")}</option>
                        <option value="YEARLY">{t("lineOptions.yearly")}</option>
                    </select>
                </div>
            </div>

            <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
                <div className="flex flex-col items-start">
                    <p className="text-3xl font-bold text-navy-700 dark:text-white">
                        {analytics && formatNumber(analytics.totalView)}
                    </p>
                    <div className="flex flex-col items-start">
                        <p className="mt-2 text-sm text-gray-600">{t("totalView")}</p>
                        <div className="flex flex-row items-center justify-center">
                            <MdArrowDropUp className="font-medium text-green-500" />
                            <p className="text-sm font-bold text-green-500"> +{analytics?.increaseRate}% </p>
                        </div>
                    </div>
                </div>
                <div className="h-full w-full">
                    <LineChart
                        options={chartOption}
                        series={chartData}
                    />
                </div>
            </div>
        </Card>
    );
};

export default TotalView;
