import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Box } from '@mui/material';
import PropTypes from 'prop-types';

const ParticipationPage = ({ userProfile }) => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/past-participated?userEmail=${encodeURIComponent(userProfile.email)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setParticipations(data);
      } else {
        console.error('Failed to fetch participations');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'creator', headerName: 'Creator', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 180 },
    { field: 'endDate', headerName: 'End Date', width: 180 },
  ];

  const rows = participations.map((participation, index) => ({
    id: index,
    title: participation.title,
    category: participation.category,
    creator: participation.creator,
    startDate: new Date(participation.startDate).toLocaleString(),
    endDate: new Date(participation.endDate).toLocaleString(),
  }));

  return (
    <Box sx={{ width: '80%', margin: '80px auto'}}>
      {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>

        <CircularProgress />        </Box>

      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      )}
    </Box>
  );
};

ParticipationPage.propTypes = {
  userProfile: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default ParticipationPage;
