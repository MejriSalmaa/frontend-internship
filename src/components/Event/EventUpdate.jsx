import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import 'moment-timezone';
import {
  validateTitle,
  validateDescription,
  validateLocation,
  validateDate,
  validateStartEndDate,
  validateParticipants,
  validateCategory,
} from '../../utils/validation'; // Adjust the path as necessary

const theme = createTheme();

const EventUpdate = ({ event, onClose, onUpdate }) => {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [category, setCategory] = useState(event.category || '');
  const [location, setLocation] = useState(event.location || '');
  const [startDate, setStartDate] = useState(moment(event.start) || moment());
  const [endDate, setEndDate] = useState(moment(event.end) || moment());
  const [participants, setParticipants] = useState(event.participants.join(', ') || '');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/events/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateTitle(title)) {
      newErrors.title = 'Title must be alphabetic and cannot be empty';
    }
    if (!validateDescription(description)) {
      newErrors.description = 'Description can have alphabetics and numbers';
    }
    if (!validateCategory(category)) {
      newErrors.category = 'Category must be selected';
    }
    if (!validateLocation(location)) {
      newErrors.location = 'Location can have alphabetics and numbers';
    }
    if (!validateDate(startDate)) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    if (!validateDate(endDate)) {
      newErrors.endDate = 'End date cannot be in the past';
    }
    if (!validateStartEndDate(startDate, endDate)) {
      newErrors.endDate = 'End date should be after start date';
    }
    if (!validateParticipants(participants)) {
      newErrors.participants = 'Participants field cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const eventData = {
      title,
      description,
      category,
      location,
      startDate: startDate.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"), // Convert to UTC and format
      endDate: endDate.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),     // Convert to UTC and format
      participants: participants.split(',').map(participant => participant.trim()),
    };

    const endpoint = `http://localhost:3000/events/update/${event._id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      onUpdate(result);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Update Event
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="dense"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                select
                id="category"
                label="Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={!!errors.category}
                helperText={errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                required
                fullWidth
                id="location"
                label="Location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
              />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Stack direction="row" spacing={2} sx={{ mt: 1, width: '100%' }}>
                  <DateTimePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => {
                      console.log('Start Date changed to:', newValue.format());
                      setStartDate(newValue);
                    }}                    renderInput={(props) => (
                      <TextField
                        {...props}
                        margin="dense"
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                      />
                    )}
                  />
                  <DateTimePicker
                    label="End Date"
                    value={endDate}

                    onChange={(newValue) => {
                      console.log('End Date changed to:', newValue.format());
                      setEndDate(newValue);
                    }}                    renderInput={(props) => (
                      <TextField
                        {...props}
                        margin="dense"
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
              <TextField
                margin="dense"
                required
                fullWidth
                id="participants"
                label="Participants"
                name="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                error={!!errors.participants}
                helperText={errors.participants}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
                <Button type="submit" fullWidth variant="contained">
                  Update Event
                </Button>
                <Button fullWidth variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EventUpdate;
