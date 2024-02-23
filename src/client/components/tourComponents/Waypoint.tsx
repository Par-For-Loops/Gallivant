import React, { useState } from 'react';
import axios from 'axios';

import {
  EditIcon,
  DeleteIcon,
  Fab,
  Button,
  Card,
  CardActions,
  CardContent,
  RoomOutlinedIcon,
  Typography,
  Grid,
  TextField,
} from '../../utils/material';
// CardMedia?

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
  waypoint: Waypoint;
  id_tour: string | undefined;
  getTourWPs: (tourId: string | undefined) => void;
  edit: boolean;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, id_tour, getTourWPs, edit } = props;
  const [delModal, setDelModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const [waypointName, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

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
          getTourWPs(id_tour);
        }
      })
      .catch((err: string) =>
        console.error('Could not DELETE waypoint: ', err)
      );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {<RoomOutlinedIcon />} {waypoint.waypointName}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          {waypoint.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='flex-end'
        >
          <Grid item>
            <Gallery waypoint={waypoint} edit={edit} />
          </Grid>
          <Grid item>
            {edit && (
              <Fab
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
      </CardActions>

      <CustomModal
        className='delete-waypoint-modal'
        openModal={delModal}
        closeModal={() => setDelModal(false)}
      >
        <Typography variant='body1'>
          Are you sure you want to delete Waypoint?
        </Typography>
        <br />
        <Button
          variant='contained'
          color='error'
          size='small'
          startIcon={<DeleteIcon />}
          onClick={() => deleteWaypoint(waypoint.id)}
        >
          Delete Waypoint
        </Button>
      </CustomModal>

      <CustomModal
        className='edit-waypoint-modal'
        openModal={editModal}
        closeModal={() => setEditModal(false)}
      >
        <div>
          <Voice 
            type='name'
            label='Change the name'
            helperText='Name'
            textInput={waypointName}
            setTextInput={setName}
          />
          {/* <TextField
            autoFocus
            fullWidth
            label='Change the name'
            value={waypointName}
            onChange={(e) => handleChange(e, setName)}
            helperText='Name'
          /> */}
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
          {/* <TextField
            autoFocus
            fullWidth
            multiline
            label='Change the description'
            value={description}
            onChange={(e) => handleChange(e, setDescription)}
            helperText='Description'
          /> */}
        </div>
        <br />
        <Button
          size='small'
          variant='contained'
          startIcon={<EditIcon />}
          onClick={() => editWaypoint(waypoint.id)}
        >
          Edit
        </Button>
      </CustomModal>
    </Card>
  );
};

export default Waypoint;
