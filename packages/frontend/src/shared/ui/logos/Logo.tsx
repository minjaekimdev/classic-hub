import logoIcon from "@shared/assets/logos/classichub.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div className="self-start flex p-[1.62rem_0]">
        <div className="flex gap-[0.44rem]">
          <img className="w-7 h-7" src={logoIcon} alt="" />
          <h1 className="mt-auto text-[1.31rem]/[1.31rem] font-logo font-bold">
            ClassicHub
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
