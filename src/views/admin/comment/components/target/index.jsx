import banner from "../../../../../assets/img/profile/banner2.jpg";

import Card from "../../../../../components/card";
import React, { useState } from "react";
import { useToast } from "../../../../../utilities/toast/toast";
import { useTranslation } from "react-i18next";
import { FaRegCopy } from "react-icons/fa";
import Lightbox from "yet-another-react-lightbox";

const TargetBanner = ({ data }) => {
  const toast = useToast();
  const { t } = useTranslation();
  const [lightboxVisibility, setLightBoxVisibility] = useState(false);

  const getPhoto = () => {
    if (!data) {
      return banner;
    }

    if (data?.content) {
      return data?.content?.photoUrl;
    }

    return data?.photoUrl;
  };

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
    <div className="flex justify-center w-full">
      <Card extra={"items-center w-[675px] h-fit p-6 bg-cover"}>
        <img className="relative mt-2 flex h-72 w-full rounded-2xl cursor-pointer object-cover"
             src={getPhoto()}
             onClick={() => setLightBoxVisibility(true)}

        />
        <div className="mt-4 flex flex-col items-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            {data?.name}
          </h4>
          <p
            className="cursor-pointer text-lg font-normal text-gray-600"
            onClick={handleCopy}
          >
            {data?.id}
          </p>
        </div>
      </Card>
      <Lightbox
        open={lightboxVisibility}
        close={() => setLightBoxVisibility(false)}
        slides={[{ src: getPhoto() }]}
      />
    </div>
  );
};

export default TargetBanner;
