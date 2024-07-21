import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ReadEvent = ({ event, userEmail, onEdit, onDelete }) => {
  const isCreator = event.creator === userEmail;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography color="text.secondary">
          {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Location: {event.location}
        </Typography>
        <Typography variant="body2">
          Description: {event.description}
        </Typography>
        <Typography variant="body2">
          Category: {event.category}
        </Typography>
        <Typography variant="body2">
          Created by: {event.creator}
        </Typography>
        {isCreator && (
          <div>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
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
