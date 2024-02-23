import { useState, useEffect, useRef } from 'react';

const useSpeechToText = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web speech api is not supported.');
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.continuous = true;

    if ('webkitSpeechGrammarList' in window) {
      const grammar =
        '#JSGF V1.0; grammar punctuation; public <punctuation> = . | , | ? | ! | ; | :';
      const speechRecognitionList = new window.webkitSpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onresult = (e) => {
      let text = '';
      for (const result of e.results) {
        text += result[0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error: ', e.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};

export default useSpeechToText;
