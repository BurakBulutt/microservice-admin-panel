import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const Reply = (props) => {
  const { data } = props;

  const cartCurt = (item) => {
    const getInitials = (name) => {
      const capitalizeName = name ? name : "anonymous";
      return capitalizeName.charAt(0).toUpperCase();
    }

    return (
      <div
        key={item.id}
        className="flex items-start space-x-4 border-b border-gray-200 p-4"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
          {getInitials(item.user?.firstName)}
        </div>

        <div className="flex flex-1 flex-col">
          <p className="font-semibold text-gray-900 dark:text-white">{item.user?.firstName}</p>
          <p className="break-words text-gray-700">{item.content}</p>
          <div className="mt-2 flex items-center space-x-2 text-gray-600">
            <div className="flex items-center space-x-1 text-blue-500">
              <FaThumbsUp />
              <span>{item.likeCount?.likeCount}</span>
            </div>
            <div className="flex items-center space-x-1 text-red-500">
              <FaThumbsDown />
              <span>{item.likeCount?.dislikeCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return data && data.map((item) => cartCurt(item));
};

export default Reply;
