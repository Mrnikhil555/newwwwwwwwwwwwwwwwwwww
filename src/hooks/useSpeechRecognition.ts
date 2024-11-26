import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechRecognitionProps {
  onCommand: (command: string) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export const useSpeechRecognition = ({
  onCommand,
  onError,
  onStart,
  onStop,
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    onStop();
  }, [onStop]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, [stopListening]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      onError('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onStart();
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript;
        onCommand(command);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          onError('Please allow microphone access to use voice controls');
        } else if (event.error === 'aborted') {
          // Ignore aborted errors as they're expected when stopping
        } else {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (error) {
            stopListening();
          }
        }
      };

      recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition. Please refresh and try again.');
      setIsListening(false);
    }
  }, [onCommand, onError, onStart, isListening, stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
  };
};