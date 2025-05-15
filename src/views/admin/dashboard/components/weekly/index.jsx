import WeeklyView from "./weeklyview/index.jsx";
import {useEffect, useState} from "react";
import {sampleWeeklyResponse} from "./variable.js";
import WeeklyLike from "./weeklylike/index.jsx";

const WeeklyAnalytics = () => {
    const [analitics, setAnalytics] = useState([]);

    const [viewAnalytics, setViewAnalytics] = useState([]);
    const [likeAnalytics, setLikeAnalytics] = useState([]);

    const getAnalytics = () => {
        //TODO API CALL IS HERE
        setAnalytics(sampleWeeklyResponse);
    }

    useEffect(() => {
        getAnalytics();
    }, []);

    useEffect(() => {
        setViewAnalytics(getViewAnalitics());
    }, [analitics]);

    useEffect(() => {
        setLikeAnalytics(getLikeAnalitics());
    }, [analitics]);

    const getViewAnalitics = () => {
        return analitics.map((item) => {
            return {
                name: item.name,
                data: item.views
            }
        })
    }

    const getLikeAnalitics = () => {
        return analitics.map((item) => {
            return {
                name: item.name,
                data: item.likes
            }
        })
    }

    return (
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <WeeklyView analytics={viewAnalytics}/>
            <WeeklyLike analytics={likeAnalytics}/>
        </div>
    )
}

export default WeeklyAnalytics;