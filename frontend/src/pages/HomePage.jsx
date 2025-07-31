import React, { Suspense } from 'react';
import Header from '../components/Layout/Header';
import Hero from '../components/Route/Hero/Hero';
import Footer from '../components/Layout/Footer';

const Categories = React.lazy(() => import('../components/Route/Categories/Categories'));
const BestDeals = React.lazy(() => import('../components/Route/BestDeals/BestDeals'));
const FeaturedProducts = React.lazy(() => import('../components/Route/FeaturedProducts/FeaturedProducts'));
const Events = React.lazy(() => import('../components/Route/Events/Events'));
const Sponsored = React.lazy(() => import('../components/Route/Sponsored/Sponsored'));

const HomePage = () => (
  <div>
    <Header activeHeading={1} />
    <Hero />
    <Suspense fallback={<div>Loading...</div>}>
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProducts />
      <Sponsored />
    </Suspense>
    <Footer />
  </div>
);

export default HomePage;
