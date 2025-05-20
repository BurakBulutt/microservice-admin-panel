import { MdPermMedia } from "react-icons/md";

import Widget from "../../../components/widget/index.jsx";
import DailyTraffic from "./components/dailytraffic";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { ContentService } from "../../../services/ContentService.js";
import { MediaService } from "../../../services/MediaService.js";
import { CategoryService } from "../../../services/CategoryService.js";
import { UserService } from "../../../services/UserService.js";
import { useToast } from "../../../utilities/toast/toast.js";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";

import { FaUsers } from "react-icons/fa";
import { LuTableOfContents } from "react-icons/lu";
import TotalView from "./components/totalview/index.jsx";
import S3StorageChart from "./components/storage/index.jsx";
import WeeklyAnalytics from "./components/weekly/index.jsx";
import CustomErrorToast from "../../../components/toast/CustomErrorToast.jsx";

const contentService = new ContentService();
const mediaService = new MediaService();
const categoryService = new CategoryService();
const userService = new UserService();

const Dashboard = () => {
  const { t } = useTranslation();
  const [mostLikedContent, setMostLikedContent] = useState(undefined);
  const [mostDislikedContent, setMostDislikedContent] = useState(undefined);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);
  const [totalContentCount, setTotalContentCount] = useState(0);
  const [totalMediaCount, setTotalMediaCount] = useState(0);

  const toast = useToast();

  const catchError = useCallback(
    (error, options) => {
      toast.error(
        <CustomErrorToast
          title={error.message}
          message={error.response?.data?.message}
        />,
        options
      );
    },
    [toast]
  );

  useEffect(() => {
    contentService
      .topContent({ likeType: "LIKE" })
      .then((response) => {
        if (response.status === 200) {
          setMostLikedContent(response.data?.name);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  useEffect(() => {
    contentService
      .topContent({ likeType: "DISLIKE" })
      .then((response) => {
        if (response.status === 200) {
          setMostDislikedContent(response.data?.name);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  useEffect(() => {
    contentService
      .count()
      .then((response) => {
        if (response.status === 200) {
          setTotalContentCount(response.data);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  useEffect(() => {
    userService
      .count()
      .then((response) => {
        if (response.status === 200) {
          setTotalUserCount(response.data);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  useEffect(() => {
    categoryService
      .count()
      .then((response) => {
        if (response.status === 200) {
          setTotalCategoryCount(response.data);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  useEffect(() => {
    mediaService
      .count()
      .then((response) => {
        if (response.status === 200) {
          setTotalMediaCount(response.data);
        }
      })
      .catch((error) => {
        catchError(error);
      });
  }, []);

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 flex flex-wrap gap-5">
        <Widget
          icon={<AiFillLike className="h-7 w-7" />}
          title={t("mostLikedContent")}
          subtitle={mostLikedContent}
        />
        <Widget
          icon={<AiFillDislike className="h-6 w-6" />}
          title={t("mostDislikedContent")}
          subtitle={mostDislikedContent}
        />
        <Widget
          icon={<FaUsers className="h-6 w-6" />}
          title={t("totalNumberOfUser")}
          subtitle={totalUserCount}
        />
        <Widget
          icon={<BiSolidCategory className="h-7 w-7" />}
          title={t("totalNumberOfCategory")}
          subtitle={totalCategoryCount}
        />
        <Widget
          icon={<LuTableOfContents className="h-7 w-7" />}
          title={t("totalNumberOfContent")}
          subtitle={totalContentCount}
        />
        <Widget
          icon={<MdPermMedia className="h-6 w-6" />}
          title={t("totalNumberOfMedia")}
          subtitle={totalMediaCount}
        />
      </div>
      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalView />
        {/* Traffic chart & Pie Chart */}
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <S3StorageChart />
        </div>
      </div>
      <WeeklyAnalytics />
    </div>
  );
};

export default Dashboard;
