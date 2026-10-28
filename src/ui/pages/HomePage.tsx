import { HomeHero } from "../components/home/HomeHero";
import { HomeDiscovery } from "../components/home/HomeDiscovery";
import { HomeDelivery } from "../components/home/HomeDelivery";
import { HomeCommunity } from "../components/home/HomeCommunity";
import { HomeEnquiry } from "../components/home/HomeEnquiry";
import { useHomeMotion } from "../hooks/useHomeMotion";

export function HomePage() {
  const motionRef = useHomeMotion();
  return (
    <div ref={motionRef} className="home-page home-design">
      <HomeHero />
      <HomeDiscovery />
      <HomeDelivery />
      <HomeCommunity />
      <HomeEnquiry />
    </div>
  );
}
