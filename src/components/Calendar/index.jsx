import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';
import CreateEvent from '../Event/CreateEvent';
import EventUpdate from '../Event/EventUpdate';
import ReadEvent from '../Event/ReadEvent';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isEventUpdateVisible, setIsEventUpdateVisible] = useState(false);
  const [isReadEventVisible, setIsReadEventVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const readEventRef = useRef(null);

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
    setIsReadEventVisible(false);
    setSelectedEvent(null);
  }, []);

  const handleSelectEvent = useCallback(
    (event) => {
      console.log('Selected event:', event);
      setSelectedEvent(event);
      setIsReadEventVisible(true);
      setIsCreateEventVisible(false);
      setIsEventUpdateVisible(false);
    },
    []
  );

  const handleClickOutside = useCallback((event) => {
    if (
      readEventRef.current &&
      !readEventRef.current.contains(event.target) &&
      isReadEventVisible
    ) {
      setIsReadEventVisible(false);
      setSelectedEvent(null);
    }
  }, [isReadEventVisible]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

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
        event._id === updatedEvent._id ? { ...event, ...updatedEvent } : event
      )
    );
    setIsEventUpdateVisible(false);
    setSelectedEvent(null);
    toast.success('Event updated successfully');
    fetchEvents();
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
        setIsReadEventVisible(false);
        setSelectedEvent(null);
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
          ref={readEventRef}
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
