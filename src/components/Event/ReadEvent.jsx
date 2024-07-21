import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';

const ReadEvent = ({ event, userEmail, onEdit, onDelete }) => {
  const isCreator = event.creator === userEmail;

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1 }} />
          {event.title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1 }} />
            {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            Location: {event.location}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            Description: {event.description}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CategoryIcon sx={{ mr: 1 }} />
            Category: {event.category}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <PersonIcon sx={{ mr: 1 }} />
            Created by: {event.creator}
          </Typography>
        </Box>
        {isCreator && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

ReadEvent.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
  }).isRequired,
  userEmail: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ReadEvent;
