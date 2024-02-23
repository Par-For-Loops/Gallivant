import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Button,
  AddIcon,
  Modal,
  Stack,
  Typography,
  Grid,
  TextField,
} from '../../utils/material';

import Voice from './Voice';
const Waypoint = lazy(() => import('./Waypoint'));
const CustomModal = lazy(() => import('./Modal'));
const Map = lazy(() => import('../Map'));
const CreateReview = lazy(() => import('../CreateReview'));

type Tour = {
  id: number;
  tourName: string;
  description: string;
  id_createdByUser: number;
};

// Read review button, launches review page or modal

const Tour = (): JSX.Element => {
  // useParam hook to retrieve specific Tour
  const { id } = useParams();
  // loader returning user id from session verification
  const userId = useLoaderData();
  const [edit, setEdit] = useState<boolean>(false);
  const [tour, setTour] = useState<Tour>();
  const [creator, setCreator] = useState<string>('');

  //state for Waypoints array, modal pop-up dialog
  const [waypoints, setWaypoints] = useState<object[]>([]);
  const [wpName, setWpName] = useState<string>('');
  const [wpDesc, setWpDesc] = useState<string>('');
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [modal, setModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  //state for draggable sorting of waypoint list
  const [dragStart, setDragStart] = useState<number>(0);
  const [dragOver, setDragOver] = useState<number>(0);

  // state for writing review
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  //initial useEffect, not sure how to use params hook from loader atm
  useEffect(() => {
    getTour(id);
    getTourWPs(id);
  }, []);

  useEffect(() => {
    setEdit(userId === tour?.id_createdByUser);
  }, [tour]);

  // change event handlers for modal inputs
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  // function passed into Map to track gps coordinates for waypoint creation
  const passCoords = (long: number, lat: number) => {
    setLong(long);
    setLat(lat);
  };

  // onDragEnd handler that sorts waypoints array into new order
  const onDragEnd = () => {
    const newOrder = [...waypoints]; // spread state into new array to not mutate
    const dragged = newOrder.splice(dragStart, 1); // returns the dragged item
    newOrder.splice(dragOver, 0, ...dragged); // insert the dragged item into new position in array

    axios
      .put('/db/waypointsOrder/', { newOrder, tourId: id }) // pass the newly-ordered array (plus tourId to update join table as well)
      .then((res) => {
        if (res.status === 200) {
          getTourWPs(id); // get updated waypoints (record sorting handled by query server-side)
        }
      })
      .catch((err: string) =>
        console.error('Could not PUT updates on waypoints: ', err)
      );
  };

  // axios requests to db to get tour by id
  const getTour = (id: string | undefined) => {
    axios(`/db/tour/${id}`)
      .then(({ data }) => {
        setTour(data[0]);
        const userId = data[0].id_createdByUser;
        getCreator(userId);
      })
      .catch((err: string) => console.error('Could not GET tour by id: ', err));
  };

  // gets username of tour creator
  const getCreator = (userId: number | undefined) => {
    axios(`/db/tourCreatedBy/${userId}`)
      .then(({ data }) => {
        setCreator(data[0].username);
      })
      .catch((err: string) => console.error('Could not GET user by id: ', err));
  };

  // gets waypoints associated with the particular tourId
  const getTourWPs = (tourId: string | undefined) => {
    axios(`/db/tourWaypoints/${tourId}`)
      .then(({ data }) => {
        setWaypoints(data);
      })
      .catch((err: string) =>
        console.error('Could not GET waypoints by tour id: ', err)
      );
  };

  const openWaypointModal = () => {
    if (long && lat) {
      setModal(true);
    } else {
      setErrorModal(true);
    }
  };

  // and post waypoint to db
  const postWaypoint = () => {
    axios
      .post('/db/waypoint/', {
        waypoint: {
          waypointName: wpName,
          description: wpDesc,
          long,
          lat,
        },
        id_tour: id,
      })
      .then((res) => {
        if (res.status === 201) {
          setModal(false);
          setWpName('');
          setWpDesc('');
          getTourWPs(id);
        }
      })
      .catch((err: string) => console.error('Could not POST waypoint: ', err));
  };

  return (
    <div>
      <Stack spacing={2}>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h2' fontWeight='bold' gutterBottom>
            {tour?.tourName}
          </Typography>
          <Typography variant='body1' gutterBottom>
            {tour?.description}
          </Typography>
          <Typography variant='caption' gutterBottom>
            Created by: {creator}
          </Typography>
        </Grid>

        <Suspense fallback={<>Loading...</>}>
          <Map waypoints={waypoints} passCoords={passCoords} />
        </Suspense>

        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='baseline'
        >
          <Button
            startIcon={<AddIcon />}
            variant='contained'
            color='primary'
            onClick={() => {
              navigate(`/reviews/${id}`);
            }}
          >
            Read Reviews
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant='contained'
            color='primary'
            onClick={handleOpen}
          >
            Add Review
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Suspense fallback={<>Loading...</>}>
              <CreateReview tourId={tour?.id} />
            </Suspense>
          </Modal>
          <br />
          {edit && (
            <Button
              startIcon={<AddIcon />}
              variant='contained'
              color='primary'
              onClick={openWaypointModal}
            >
              Add Waypoint
            </Button>
          )}
        </Grid>

        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='baseline'
        >
          <Typography variant='h3' gutterBottom>
            Waypoints
          </Typography>
        </Grid>

        <Stack spacing={1} className='waypoint-stack'>
          {waypoints.map((wp, i) => (
            <div
              key={i}
              draggable={edit}
              onDragStart={() => setDragStart(i)}
              onDragEnter={() => setDragOver(i)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <Suspense fallback={<>Loading...</>}>
                <Waypoint
                  getTourWPs={getTourWPs}
                  id_tour={id}
                  waypoint={wp}
                  edit={edit}
                />
              </Suspense>
            </div>
          ))}
        </Stack>
      </Stack>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal openModal={modal} closeModal={() => setModal(false)}>
          <div>
            <Voice
              type='name'
              label='Give the waypoint a name'
              helperText='Waypoint Name'
              textInput={wpName}
              setTextInput={setWpName}
            />
            {/* <TextField
              autoFocus
              fullWidth
              label='Give the waypoint a name'
              value={wpName}
              onChange={(e) => handleChange(e, setWpName)}
              helperText='Waypoint Name'
            /> */}
          </div>
          <br />
          <div>
            <Voice
              type='description'
              label='Give the waypoint a description'
              helperText='Waypoint Description'
              textInput={wpDesc}
              setTextInput={setWpDesc}
            />
            {/* <TextField
              autoFocus
              fullWidth
              multiline
              label='Give the waypoint a description'
              value={wpDesc}
              onChange={(e) => handleChange(e, setWpDesc)}
              helperText='Waypoint Description'
            /> */}
          </div>
          <br />
          <Button
            startIcon={<AddIcon />}
            size='small'
            variant='contained'
            color='primary'
            onClick={postWaypoint}
          >
            Save waypoint
          </Button>
        </CustomModal>
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal
          openModal={errorModal}
          closeModal={() => setErrorModal(false)}
        >
          <Typography variant='body1'>
            Please click location on map first.
          </Typography>
          <br />
        </CustomModal>
      </Suspense>
    </div>
  );
};

export default Tour;
