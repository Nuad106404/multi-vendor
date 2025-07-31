import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2024/07/03/07/50/table-8869129_1280.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] capitalize`}
        >
          Best Collection for <br /> home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[400] text-[#000000ba] font-[Poppins]">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Quam suscipit
          finibus sociosqu lobortis inceptos non pulvinar auctor. Placerat
          phasellus eros placerat erat hac curae sit. Suspendisse odio nascetur
          ornare dapibus fames, potenti ex potenti. Imperdiet fusce eleifend
          tempor imperdiet, faucibus sit class.
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
