import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';
import CreateEvent from '../Event/CreateEvent'; // Adjust the import path as per your project structure
import EventUpdate from '../Event/EventUpdate'; // Adjust the import path as per your project structure
import ReadEvent from '../Event/ReadEvent'; // Adjust the import path as per your project structure

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isEventUpdateVisible, setIsEventUpdateVisible] = useState(false);
  const [isReadEventVisible, setIsReadEventVisible] = useState(false); // State to track ReadEvent visibility
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
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
        data = data.map((event) => ({
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

  const handleSelectEvent = useCallback(
    (event) => {
      console.log('Selected event:', event); // This should log when an event is selected

      // Toggle ReadEvent visibility
      if (selectedEvent && selectedEvent._id === event._id) {
        setIsReadEventVisible(!isReadEventVisible);
      } else {
        setSelectedEvent(event);
        setIsReadEventVisible(true);
      }
      setIsEventUpdateVisible(false); // Ensure not updating while opening ReadEvent
    },
    [isReadEventVisible, selectedEvent]
  );

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
    setIsEventUpdateVisible(false);
    setSelectedEvent(null);
  };

  const editEvent = (event) => {
    console.log('Editing event:', event);

    setSelectedEvent(event);
    setIsEventUpdateVisible(true);
  };

  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/events/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
        toast.success('Event deleted successfully');
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      toast.error('Network error');
    }
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
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
      {isReadEventVisible && selectedEvent && !isEventUpdateVisible && (
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
          <ReadEvent
            event={selectedEvent}
            userEmail={userEmail}
            onEdit={() => {
              console.log('onEdit triggered');
              editEvent(selectedEvent);
            }}
            onDelete={() => deleteEvent(selectedEvent._id)}
          />
        </div>
      )}
      {isEventUpdateVisible && selectedEvent && (
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
