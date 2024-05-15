import Carousel from "./Carousel";
import slide1 from "../../../assets/img/slide1.jpg";
import slide2 from "../../../assets/img/slide2.jpg";
import slide3 from "../../../assets/img/slide3.jpg";

const Hero = () => {
  return (
    <section className="my-4 px-8 lg:px-24 py-4 text-black">
      <h1 className="mb-5 font-light text-title-xxl">
        Transforming spaces with <span className="text-primary">art</span> and{" "}
        <span className="text-primary">design</span>.
      </h1>
      <Carousel>
        <img src={slide1} alt="" />
        <img src={slide2} alt="" />
        <img src={slide3} alt="" />
      </Carousel>
    </section>
  );
};

export default Hero;
