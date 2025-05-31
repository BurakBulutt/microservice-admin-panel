import banner from "../../../../../assets/img/profile/banner2.jpg";

import Card from "../../../../../components/card";
import React, { useRef, useState } from "react";
import { useToast } from "../../../../../utilities/toast/toast";
import { useTranslation } from "react-i18next";
import { FaRegCopy } from "react-icons/fa";
import Lightbox from "yet-another-react-lightbox";

const TargetBanner = ({ data }) => {
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const toast = useToast();
  const { t } = useTranslation();
  const [lightboxVisibility, setLightBoxVisibility] = useState(false);

  const getPhoto = () => {
    if (data?.content) {
      return data?.content?.photoUrl;
    }
    return data?.photoUrl;
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;

    setBgPosition((prev) => {
      const newX = Math.min(100, Math.max(0, prev.x - dx * 0.2));
      const newY = Math.min(100, Math.max(0, prev.y - dy * 0.2));
      return { x: newX, y: newY };
    });

    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
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
        <div
          className="relative mt-2 flex h-[243px] w-full items-center justify-center rounded-2xl bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${data ? getPhoto() : banner})`,
            backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
            cursor: isDragging.current ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute -bottom-12 flex h-[84px] w-[84px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
            <img
              className="h-full w-full rounded-full object-cover"
              src={data ? getPhoto() : banner}
              alt={data?.name}
              onClick={() => setLightBoxVisibility(true)}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center">
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
