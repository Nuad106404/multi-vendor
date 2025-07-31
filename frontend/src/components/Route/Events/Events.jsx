import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../../../redux/actions/event'; // Adjust path if necessary
import styles from '../../../styles/styles';
import EventCard from './EventCard';

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    // Dispatch the action to load all events when component mounts
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div className={`${styles.section} py-10`}>
      <div className={`${styles.heading} text-center mb-8`}>
        <h1 className="text-4xl font-bold">Popular Events</h1>
      </div>
      <div className="w-full flex justify-center">
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
    </div>
  );
};

export default Events;
