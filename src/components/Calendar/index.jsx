import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CreateEvent from '../Event/CreateEvent'; // Adjust the import path as per your project structure
import EventUpdate from '../Event/EventUpdate'; // Adjust the import path as per your project structure

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isEventUpdateVisible, setIsEventUpdateVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:3000/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        let data = await response.json();
        console.log('Fetched events:', data);

        // Convert date strings to Date objects
        data = data.map(event => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }));

        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedDate(slotInfo.start);
    setIsCreateEventVisible(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsEventUpdateVisible(true);
  }, []);

  const handleCloseCreateEvent = () => {
    setIsCreateEventVisible(false);
    setSelectedDate(null);
  };

  const handleCloseEventUpdate = () => {
    setIsEventUpdateVisible(false);
    setSelectedEvent(null);
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  return (
    <div style={{ height: 500, position: 'relative' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {isCreateEventVisible && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            zIndex: 999,
            padding: 20,
            borderRadius: 8,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CreateEvent selectedDate={selectedDate} onClose={handleCloseCreateEvent} />
        </div>
      )}
      {isEventUpdateVisible && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            zIndex: 999,
            padding: 20,
            borderRadius: 8,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <EventUpdate event={selectedEvent} onClose={handleCloseEventUpdate} onUpdate={handleEventUpdate} />
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
