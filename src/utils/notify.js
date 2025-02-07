import { toast } from "react-toastify";

export const notify = (name, message) => {
    toast.dismiss();
    toast(<span className="line-clamp-4 mr-[30px] md:mr-[0px] lg:mr-[0px] xl:mr-[0px] 2xl:mr-[0px]"  >{`${name} ${message}`}</span>)
};
