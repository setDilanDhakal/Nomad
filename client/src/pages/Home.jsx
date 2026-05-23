import Hero from "../components/Hero.jsx";
import Slider from "../components/Slider.jsx";
import Card from "../components/cards.jsx";
import Rating from "../components/Rating.jsx";
import GridImages from "../components/GridImages.jsx";
function Home() {
  return (
    <div>
      <Hero />
      <Slider />
      <Card />
      <GridImages />
      <Rating />
    </div>
  );
}

export default Home;
