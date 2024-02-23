import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';

import {
  Box,
  Button,
  AddIcon,
  ExploreIcon,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  MenuItem,
  Modal,
  Select,
  Typography,
  // TextField,
} from '../utils/material';

import Voice from './tourComponents/Voice';

const Tours = (): JSX.Element => {
  type Tour = {
    id: number;
    tourName: string;
    description: string;
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const [createModal, setCreateModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const categories = [
    'arts & culture',
    'entertainment',
    'food & drink',
    'history',
    'nightlife',
    'history',
    'nature & outdoors',
    'miscellaneous',
  ];

  useEffect(() => {
    getAllTours();
  }, []);

  const getAllTours = () => {
    axios('/db/tours')
      .then(({ data }) => {
        setTours(data);
      })
      .catch((err: string) => console.error('Could not GET all tours: ', err));
  };

  const createTourBtnClick = () => {
    if (tourName && description) {
      axios
        .post('/db/tours', { tour: { tourName, description, category } })
        .then((res) => {
          if (res.status === 201) {
            getAllTours();
            setName('');
            setDescription('');
            setCreateModal(false);
          }
        })
        .catch((err: string) => console.error('Could not POST tour: ', err));
    } else {
      setErrorModal(true);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  const handleCatChange = (event) => {
    setCategory(event.target.value as string);
  };

  return (
    <div>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='flex-end'
      >
        <Grid item>
          <Typography fontWeight='bold' variant='h2'>
            Tours
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setCreateModal(true)}
          >
            Create Tour
          </Button>
        </Grid>
      </Grid>
      <Categories categories={categories}/>

      <List>
        {tours.map((tour, i) => {
          return (
            <ListItem key={i}>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Link to={`/tour/${tour.id}`}>{tour.tourName}</Link>}
                secondary={tour.description}
              />
            </ListItem>
          );
        })}
      </List>

      <Modal open={errorModal} onClose={() => setErrorModal(false)}>
        <Typography variant='body1'>
          Please give tour a name and description.
        </Typography>
      </Modal>

      <Modal open={createModal} onClose={() => setCreateModal(false)}>
        <Box
          // height={300}
          // width={300}
          my={4}
          display="flex"
          alignItems="center"
          gap={4}
          p={2}
          sx={{ border: '2px solid grey', bgcolor: 'white' }}
        >
        <div>
          <Voice
            type='name'
            label='Give your tour a name'
            helperText='Tour Description'
            textInput={tourName}
            setTextInput={setName}
          />
          {/* <TextField
            autoFocus
            fullWidth
            label='Give your tour a name'
            value={tourName}
            onChange={(e) => handleChange(e, setName)}
            helperText='Tour Name'
          />
        </div>
        <br />
        <div>
          <TextField
            autoFocus
            fullWidth
            multiline
            label='Give your tour a description'
            value={description}
            onChange={(e) => handleChange(e, setDescription)}
            helperText='Tour Description'
          />
        </div>
        <br />

        <Button
          variant='contained'
          size='small'
          color='primary'
          startIcon={<AddIcon />}
          onClick={createTourBtnClick}
        >
          Create Tour
        </Button>
        </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Tours;
