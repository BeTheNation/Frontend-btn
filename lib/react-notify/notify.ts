import { Bounce, toast } from "react-toastify";

export const buySuccess = () =>
  toast.success("Buy Success", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
