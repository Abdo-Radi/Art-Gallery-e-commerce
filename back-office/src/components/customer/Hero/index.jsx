import Carousel from "./Carousel";
import slide1 from "../../../assets/img/slide1.jpg";
import slide2 from "../../../assets/img/slide2.jpg";
import slide3 from "../../../assets/img/slide3.jpg";

const Hero = () => {
  return (
    <section className="mt-8">
      <Carousel>
        <img src={slide1} alt="" />
        <img src={slide2} alt="" />
        <img src={slide3} alt="" />
      </Carousel>
    </section>
  );
};

export default Hero;
