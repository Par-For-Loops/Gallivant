import React, { useState } from 'react';
import axios from 'axios';

import {
  Button,
  TextField,
  Rating,
  SendIcon,
  Typography
} from '../utils/material';


const CreateReview = ({ tourId, handleClose }) => {
  const [value, setValue] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const postReview = () => {
    axios.post('/reviews/post', {
      feedback: reviewText,
      rating: value,
      id_tour: tourId
    })
    .catch(err => console.error('Axios post error ', err));
  };

  return (
    <div className="create-review">
      <Typography component="legend">Rate This Tour</Typography>
      <Rating
        name="no-value"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      <br />
      <TextField
        id="outlined-multiline-static"
        sx={{ width: '100%' }}
        multiline
        rows={4}
        placeholder="Leave a Review"
        margin="normal"
        onChange={(event) => {
          event.preventDefault();
          setReviewText(event.target.value);
        }}
      />
      <br />
      <Button
        type="submit"
        sx={{ marginBottom: '10px'}}
        variant="contained"
        endIcon={<SendIcon />}
        onClick={(e) => {
          e.preventDefault();
          postReview();
          handleClose();
        }}
      >
        Post Review
      </Button>
    </div>
  );

};

export default CreateReview;