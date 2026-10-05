import { Hero } from "@/components/home/Hero";
import { MenuSection } from "@/components/menu/MenuSection";
import { DeliverySection } from "@/components/home/DeliverySection";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      <Hero />
      <MenuSection />
      <DeliverySection />
      {/* Les autres sections viendront ici */}
    </main>
  );
}
