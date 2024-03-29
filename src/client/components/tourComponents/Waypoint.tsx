import React, { useState } from 'react';
import axios from 'axios';

import {
  EditIcon,
  DeleteIcon,
  Fab,
  Button,
  Card,
  RoomOutlinedIcon,
  Typography,
  Grid,
} from '../../utils/material';

import CustomModal from './Modal';
import Gallery from '../Gallery';
import Voice from './Voice';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};
interface WaypointProps {
  updateOrder: () => void;
  waypoint: Waypoint;
  id_tour: string | undefined;
  getTourWPs: (tourId: string | undefined) => void;
  edit: boolean;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, id_tour, getTourWPs, edit, updateOrder } = props;
  const [delModal, setDelModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const [waypointName, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const openEditModal = () => {
    setEditModal(true);
    setName(waypoint.waypointName);
    setDescription(waypoint.description);
  };

  const editWaypoint = (wpId: number) => {
    axios
      .put(`/db/waypoint/${wpId}`, {
        waypointName,
        description,
      })
      .then((res) => {
        if (res.status === 200) {
          setEditModal(false);
          getTourWPs(id_tour);
        }
      })
      .catch((err: string) => console.error('Could not EDIT waypoint: ', err));
  };

  const deleteWaypoint = (wpId: number) => {
    axios
      .delete(`/db/waypoint/${wpId}/${id_tour}`)
      .then((res) => {
        if (res.status === 200) {
          setDelModal(false);
          updateOrder();
          getTourWPs(id_tour);
        }
      })
      .catch((err: string) =>
        console.error('Could not DELETE waypoint: ', err)
      );
  };

  return (
    <Card
      className='waypoint-card'
      sx={{
        backgroundColor: 'rgba(255, 255, 255, .9)'
      }}
    >
      <Grid
        container
        direction='row'
        justifyContent='start'
      >
        <Grid item>
          <Gallery waypoint={waypoint} edit={edit} />
        </Grid>
        <Grid sx={{ padding: '1rem', maxWidth: { md: '268px'} }} item >
          <Typography variant='h4' fontWeight='bold' fontSize={'20px'}>
            {<RoomOutlinedIcon />} {waypoint.waypointName}
          </Typography>
          <Typography variant='subtitle1'>{waypoint.description}</Typography>
        </Grid>
        <Grid
          container
          direction='row'
          justifyContent='end'
          alignItems='center'
        >
          <Grid justifyContent='end' alignItems='center' item>
            {edit && (
              <Fab
                sx={{ margin: '.5rem' }}
                aria-label='delete'
                size='small'
                color='error'
                onClick={() => setDelModal(true)}
              >
                <DeleteIcon />
              </Fab>
            )}
            {edit && (
              <Fab
                sx={{ margin: '.5rem' }}
                aria-label='edit'
                color='primary'
                size='small'
                onClick={openEditModal}
              >
                <EditIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </Grid>

      <CustomModal
        className='delete-waypoint-modal'
        openModal={delModal}
        closeModal={() => setDelModal(false)}
        confirmButton={
          <Button
            variant='contained'
            color='error'
            size='small'
            startIcon={<DeleteIcon />}
            onClick={() => deleteWaypoint(waypoint.id)}
          >
            Delete Waypoint
          </Button>
        }
      >
        <Typography variant='body1'>
          Are you sure you want to delete Waypoint?
        </Typography>
        <br />
      </CustomModal>

      <CustomModal
        className='edit-waypoint-modal'
        openModal={editModal}
        closeModal={() => setEditModal(false)}
        confirmButton={
          <Button
            size='small'
            variant='contained'
            startIcon={<EditIcon />}
            onClick={() => editWaypoint(waypoint.id)}
          >
            Edit
          </Button>
        }
      >
        <div>
          <Voice
            type='name'
            label='Change the name'
            helperText='Name'
            textInput={waypointName}
            setTextInput={setName}
          />
        </div>
        <br />
        <div>
          <Voice
            type='description'
            label='Change the description'
            helperText='Description'
            textInput={description}
            setTextInput={setDescription}
          />
        </div>
        <br />
      </CustomModal>
    </Card>
  );
};

export default Waypoint;
