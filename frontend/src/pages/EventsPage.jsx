// EventsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Layout/Header';
import EventCard from '../components/Route/Events/EventCard';
import Footer from '../components/Layout/Footer';
import { getAllEvents } from '../redux/actions/event';
import styles from "../styles/styles";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <Header activeHeading={4} />
      <div className={`${styles.section} py-10`}>
        {isLoading ? (
          <p className="text-center text-xl py-10">Loading events...</p>
        ) : allEvents && allEvents.length > 0 ? (
          allEvents.map((event) => (
            <EventCard key={event._id} event={event} active={true} />
          ))
        ) : (
          <p className="text-center text-xl py-10">No events available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
