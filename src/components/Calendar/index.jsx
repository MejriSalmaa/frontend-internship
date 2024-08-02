import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import CreateEvent from '../Event/CreateEvent';
import EventUpdate from '../Event/EventUpdate';
import ReadEvent from '../Event/ReadEvent';
import PropTypes from 'prop-types';
import './Style.css'; // Import custom CSS for calendar styling

const localizer = momentLocalizer(moment);

const categoryColors = {
  'Anniversaire': '#af7ab1',
  'Teambuilding': '#652586',
  'Événement social': '#98c01f',
  'Événement sportif': '#708d33',
  'Séminaire': '#e60513',
  'Formation': '#ea9901'
};

const MyCalendar = ({ events: initialEvents }) => {
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isEventUpdateVisible, setIsEventUpdateVisible] = useState(false);
  const [isReadEventVisible, setIsReadEventVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [events, setEvents] = useState([]);
  const readEventRef = useRef(null);

  // Decode token and set user email
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
  }, []);

  // Update events when initialEvents prop changes
  useEffect(() => {
    if (initialEvents) {
      // Convert date strings to Date objects
      const updatedEvents = initialEvents.map((event) => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }));
      setEvents(updatedEvents);
    }
  }, [initialEvents]);

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

  const dayPropGetter = (date) => {
    const currentDate = moment().startOf('day');
    const dateToCheck = moment(date).startOf('day');

    if (dateToCheck.isSame(currentDate)) {
      return {
        className: 'current-day'
      };
    }
    return {};
  };

  const eventPropGetter = (event) => {
    const backgroundColor = categoryColors[event.category] || '#3174ad';
    return {
      style: { backgroundColor }
    };
  };

  return (
    <div style={{ height: 500, position: 'relative' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
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

MyCalendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MyCalendar;
