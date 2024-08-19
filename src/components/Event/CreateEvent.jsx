import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Box, Typography, TextField, Button, Container, Stack, MenuItem,
  Autocomplete, Chip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {
  validateTitle, validateDescription, validateLocation, validateDate,
  validateStartEndDate, validateParticipants, validateCategory
} from '../../utils/validation.js';

const theme = createTheme();

const CreateEvent = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [participants, setParticipants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [participantSuggestions, setParticipantSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);

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

  const fetchParticipantSuggestions = async (search) => {
    if (!search) {
      setItems([]);
      return;
    }
    try {
      const encodedSearch = encodeURIComponent(search.trim());
      const url = `http://localhost:3000/users/emails/${encodedSearch}`;
      console.log(`Fetching URL: ${url}`);
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setItems(data.map(email => email));
      } else {
        console.error('Failed to fetch participant suggestions');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const debouncedFetchParticipantSuggestions = useCallback(debounce(fetchParticipantSuggestions, 300), []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const eventData = {
      title,
      description,
      category,
      location,
      startDate: startDate.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endDate: endDate.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      participants,
    };

    try {
      const response = await fetch('http://localhost:3000/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);

        // Clear form
        setTitle('');
        setDescription('');
        setCategory('');
        setLocation('');
        setStartDate(moment());
        setEndDate(moment());
        setParticipants([]);
        setErrors({});
        onClose(); // Close the form
      } else {
        console.error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    // Clear form and close the modal without saving
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setStartDate(moment());
    setEndDate(moment());
    setParticipants([]);
    setErrors({});
    onClose();
  };

  const handleOnInputChange = (event, value) => {
    debouncedFetchParticipantSuggestions(value);
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
            Create Event
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
              rows={3}
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
                  dateFormat="DD-MMM-YYYY HH:mm"
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(props) => (
                    <TextField {...props} margin="dense" fullWidth error={!!errors.startDate} helperText={errors.startDate} />
                  )}
                />
                <DateTimePicker
                  label="End Date"
                  value={endDate}
                  dateFormat="DD-MMM-YYYY HH:mm"
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(props) => (
                    <TextField {...props} margin="dense" fullWidth error={!!errors.endDate} helperText={errors.endDate} />
                  )}
                />
              </Stack>
            </LocalizationProvider>
            <div style={{ margin: '10px 0' }}>
              <Autocomplete
                multiple
                freeSolo
                options={items}
                getOptionLabel={(option) => option}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Participants by Email"
                    variant="outlined"
                    margin="dense"
                    error={!!errors.participants}
                    helperText={errors.participants}
                  />
                )}
                value={participants}
                onChange={(event, newValue) => {
                  setParticipants(newValue);
                }}
                onInputChange={handleOnInputChange}
              />
            </div>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Event
              </Button>
              <Button
                onClick={handleCancel}
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateEvent;
