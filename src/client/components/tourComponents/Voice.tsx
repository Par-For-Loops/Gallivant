import React from 'react';
import useSpeechToText from '../../utils/speechToText';

import { TextField, Fab, MicIcon, MicOffIcon } from '../../utils/material';

const Voice = ({ textInput, setTextInput, type, label, helperText }): JSX.Element => {
  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText();

  const stopVoiceInput = () => {
    setTextInput(
      (prevState) =>
        prevState +
        (transcript.length ? (prevState.length ? ' ' : '') + transcript : '')
    );
    stopListening();
  };

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  return (
    <div>
      <TextField
        disabled={isListening}
        autoFocus={type === 'name'}
        multiline={type === 'description'}
        label={label}
        helperText={helperText}
        onChange={(e) => setTextInput(e.target.value)}
        value={
          isListening
            ? textInput +
              (transcript.length
                ? (textInput.length ? ' ' : '') + transcript
                : '')
            : textInput
        }
      />
      <Fab
        size='small'
        color={isListening ? 'warning' : 'success'}
        onClick={() => startStopListening()}
      >
        {isListening ? <MicOffIcon /> : <MicIcon />}
      </Fab>
    </div>
  );
};

export default Voice;
