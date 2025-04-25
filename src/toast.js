import { ToastContainer, Bounce, toast } from "react-toastify";
const options = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};
const displayMsg = (msg, type) => {
  switch (type) {
    case "error":
      toast.error(msg, { ...options });
      break;
    case "success":
      toast.success(msg, { ...options });
      break;
  }
};
function Toast() {
  return <ToastContainer />;
}
export { Toast, displayMsg };
