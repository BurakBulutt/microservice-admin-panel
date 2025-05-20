import { memo } from "react";

const CustomErrorToast = ({ title, message }) => {
  return (
    <div>
      <strong>{title}</strong>
      <div>{message}</div>
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
