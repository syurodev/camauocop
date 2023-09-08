import React from "react";

import Categories from "@/components/Categories";
import Promotions from "@/components/Promotion";
import Recommendation from "@/components/Recommendation";

const HomePage: React.FC = () => {
  return (
    <section className="flex flex-col place-items-center justify-center pt-5">
      <Promotions />
      <Categories className="mt-4" />
      <Recommendation className="mt-4" />
    </section>
  );
};

export default HomePage;
