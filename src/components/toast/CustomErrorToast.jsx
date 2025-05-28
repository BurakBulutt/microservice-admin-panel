import { memo } from "react";

const CustomErrorToast = ({ title, message }) => {

    const getMessage = () => {
        if(!message) return '';

        if (message.errors) {
            return JSON.stringify(message.errors);
        }

        return message.message;
    }

  return (
    <div>
      <strong>{title}</strong>
      <div>{getMessage()}</div>
    </div>
  );
};

function propsAreEqual(prevProps, nextProps) {
  return (
    prevProps.title === nextProps.title &&
    prevProps.message === nextProps.message
  );
}

export default memo(CustomErrorToast, propsAreEqual);
