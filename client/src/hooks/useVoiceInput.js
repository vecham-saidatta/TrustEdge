/**
 * useVoiceInput — Web Speech API hook for SAGE Chat
 *
 * Provides real-time speech-to-text via the browser's SpeechRecognition API.
 * Pre-claims the microphone via getUserMedia to ensure exclusive access,
 * then starts recognition for transcription.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Vendor-prefixed SpeechRecognition ────────────────────────
const SpeechRecognitionAPI =
    typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

// ── Error messages for humans ────────────────────────────────
const ERROR_MESSAGES = {
    'not-allowed':
        'Microphone access denied. Please enable it in your browser settings.',
    'no-speech':
        'No speech detected. Try speaking louder or check your microphone.',
    'audio-capture':
        'No microphone found. Please connect a microphone and try again.',
    'network':
        'Network error. Voice input requires an internet connection.',
    'service-not-allowed':
        'Speech service is unavailable. Please type your message instead.',
    'language-not-supported':
        'This language is not supported for voice input.',
    'aborted': null,
    'default':
        'Voice input encountered an error. Please try again.',
};

/**
 * @param {Object}  options
 * @param {string}  options.lang            — BCP-47 language (default: 'en-US')
 * @param {number}  options.silenceTimeout  — ms of silence before auto-stop (default: 4000)
 * @param {number}  options.maxDuration     — ms max recording length (default: 60000)
 */
export default function useVoiceInput({
    lang = 'en-US',
    silenceTimeout = 4000,
    maxDuration = 60000,
} = {}) {
    const isSupported = !!SpeechRecognitionAPI;

    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [error, setError] = useState(null);

    // ── Refs ─────────────────────────────────────────────────
    const recognitionRef = useRef(null);
    const mediaStreamRef = useRef(null);        // getUserMedia stream
    const silenceTimerRef = useRef(null);
    const maxTimerRef = useRef(null);
    const isListeningRef = useRef(false);
    const shouldRestartRef = useRef(false);
    const accumulatedRef = useRef('');
    const resultReceivedRef = useRef(false);     // track if we ever got results

    // ── Timer helpers ────────────────────────────────────────
    const clearAllTimers = useCallback(() => {
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
        if (maxTimerRef.current) { clearTimeout(maxTimerRef.current); maxTimerRef.current = null; }
    }, []);

    const startSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
                console.log('[SAGE Voice] Silence timeout — stopping');
                shouldRestartRef.current = false;
                try { recognitionRef.current.stop(); } catch (_e) { /* noop */ }
            }
        }, silenceTimeout);
    }, [silenceTimeout]);

    // ── Release microphone stream ────────────────────────────
    const releaseStream = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }
    }, []);

    // ── Full stop + cleanup ──────────────────────────────────
    const fullStop = useCallback(() => {
        shouldRestartRef.current = false;
        isListeningRef.current = false;
        clearAllTimers();
        setIsListening(false);
        setInterimTranscript('');

        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (_e) { /* noop */ }
        }
        releaseStream();
    }, [clearAllTimers, releaseStream]);

    // ── startListening ───────────────────────────────────────
    const startListening = useCallback(async () => {
        if (!isSupported) return;
        if (isListeningRef.current) return;

        setError(null);
        setInterimTranscript('');
        accumulatedRef.current = '';
        setFinalTranscript('');
        resultReceivedRef.current = false;

        // ── Step 1: Claim microphone via getUserMedia ────────
        // This forces the browser to grab the mic BEFORE speech
        // recognition starts, solving conflicts with Zoom/Teams/etc.
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            console.log('[SAGE Voice] Microphone stream acquired');
        } catch (err) {
            console.error('[SAGE Voice] getUserMedia failed:', err);
            const msg = err.name === 'NotAllowedError'
                ? ERROR_MESSAGES['not-allowed']
                : err.name === 'NotFoundError'
                    ? ERROR_MESSAGES['audio-capture']
                    : ERROR_MESSAGES['default'];
            setError(msg);
            setTimeout(() => setError(null), 5000);
            return;
        }

        // ── Step 2: Create fresh recognition instance ────────
        // Creating a new instance each time avoids stale state bugs.
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = lang;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            resultReceivedRef.current = true;
            let interim = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalText += transcript;
                } else {
                    interim += transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
                startSilenceTimer();
            }

            if (finalText) {
                const trimmed = finalText.trim();
                accumulatedRef.current += (accumulatedRef.current ? ' ' : '') + trimmed;
                setFinalTranscript(accumulatedRef.current);
                setInterimTranscript('');
                startSilenceTimer();
                console.log('[SAGE Voice] Final:', accumulatedRef.current);
            }
        };

        recognition.onend = () => {
            console.log('[SAGE Voice] onend fired, shouldRestart:', shouldRestartRef.current);
            if (shouldRestartRef.current && isListeningRef.current) {
                try {
                    recognition.start();
                    console.log('[SAGE Voice] Auto-restarted');
                    return;
                } catch (_e) {
                    console.warn('[SAGE Voice] Restart failed');
                }
            }
            // Full cleanup
            isListeningRef.current = false;
            setIsListening(false);
            setInterimTranscript('');
            clearAllTimers();
            releaseStream();
        };

        recognition.onerror = (event) => {
            const code = event.error;
            console.warn('[SAGE Voice] Error:', code);

            if (code === 'aborted') return;

            if (code === 'no-speech') {
                setError(ERROR_MESSAGES['no-speech']);
                setTimeout(() => setError(null), 3000);
                // Don't stop — let user keep trying
                return;
            }

            const message = ERROR_MESSAGES[code] || ERROR_MESSAGES['default'];
            setError(message);
            setTimeout(() => setError(null), 5000);

            // Stop on serious errors
            fullStop();
        };

        recognition.onaudiostart = () => {
            console.log('[SAGE Voice] Audio started — mic is active');
            startSilenceTimer();
        };

        recognition.onspeechstart = () => {
            console.log('[SAGE Voice] Speech detected!');
        };

        recognitionRef.current = recognition;

        // ── Step 3: Start recognition ────────────────────────
        shouldRestartRef.current = true;
        isListeningRef.current = true;
        setIsListening(true);

        try {
            recognition.start();
            console.log('[SAGE Voice] Recognition started');
        } catch (err) {
            console.error('[SAGE Voice] Start failed:', err);
            fullStop();
            setError('Failed to start voice input. Please try again.');
            setTimeout(() => setError(null), 5000);
            return;
        }

        // Safety max-duration timer
        maxTimerRef.current = setTimeout(() => {
            console.log('[SAGE Voice] Max duration reached — stopping');
            shouldRestartRef.current = false;
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_e) { /* noop */ }
            }
        }, maxDuration);

    }, [isSupported, lang, silenceTimeout, maxDuration, clearAllTimers, startSilenceTimer, releaseStream, fullStop]);

    // ── stopListening ────────────────────────────────────────
    const stopListening = useCallback(() => {
        shouldRestartRef.current = false;
        clearAllTimers();

        if (recognitionRef.current && isListeningRef.current) {
            try {
                recognitionRef.current.stop();
                console.log('[SAGE Voice] Stopped by user');
            } catch (_e) {
                fullStop();
            }
        }
    }, [clearAllTimers, fullStop]);

    // ── resetTranscript ──────────────────────────────────────
    const resetTranscript = useCallback(() => {
        accumulatedRef.current = '';
        setFinalTranscript('');
        setInterimTranscript('');
    }, []);

    // ── dismissError ─────────────────────────────────────────
    const dismissError = useCallback(() => setError(null), []);

    // ── Cleanup on unmount ───────────────────────────────────
    useEffect(() => {
        return () => {
            shouldRestartRef.current = false;
            isListeningRef.current = false;
            clearAllTimers();
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (_e) { /* noop */ }
            }
            releaseStream();
        };
    }, [clearAllTimers, releaseStream]);

    return {
        isSupported,
        isListening,
        interimTranscript,
        finalTranscript,
        error,
        startListening,
        stopListening,
        resetTranscript,
        dismissError,
    };
}
