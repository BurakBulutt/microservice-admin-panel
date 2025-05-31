import Card from "../../../../../components/card";
import banner from "../../../../../assets/img/profile/banner.png";
import React from "react";
import { useToast } from "../../../../../utilities/toast/toast";
import { useTranslation } from "react-i18next";
import { FaRegCopy } from "react-icons/fa";

const UserBanner = (props) => {
  const { data } = props;
  const toast = useToast();
  const { t } = useTranslation();

  const capitalizeFirstLetter = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  };

  const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${capitalizeFirstLetter(
    data?.firstName
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.id);
      toast.success(t("copy.success"), {
        icon: <FaRegCopy />,
      });
    } catch (err) {
      toast.error(t("copy.fail"), {
        icon: <FaRegCopy />,
      });
    }
  };

  return (
    <Card extra={"items-center w-full h-fit p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-40 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-14 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img
            className="h-full w-full rounded-full"
            src={profileImageUrl}
            alt={data?.firstName}
          />
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {capitalizeFirstLetter(data?.firstName) +
            " " +
            capitalizeFirstLetter(data?.lastName)}
        </h4>
        <p className="cursor-pointer text-base font-normal text-gray-600" onClick={handleCopy}>{data?.id}</p>
      </div>
    </Card>
  );
};

export default UserBanner;
