import { Mic, MicOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface VoiceCommandProps {
  open: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

const EXAMPLE_COMMANDS = [
  "Show today's orders",
  "Open menu editor",
  "Search pizza",
  "Show revenue analytics",
  "Open dashboard",
];

export default function VoiceCommand({
  open,
  onClose,
  onCommand,
}: VoiceCommandProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!open) {
      setListening(false);
      setTranscript("");
      recognitionRef.current?.stop();
    }
  }, [open]);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition() as any;
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(text);
      if (e.results[e.results.length - 1].isFinal) {
        onCommand(text);
        onClose();
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="voice-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        <motion.div
          data-ocid="voice.modal"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-dark border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
        >
          <button
            type="button"
            data-ocid="voice.close_button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Voice Command
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Control Food Haveli with your voice
          </p>

          {/* Mic button */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              data-ocid="voice.toggle"
              onClick={listening ? stopListening : startListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                listening
                  ? "bg-red-500/20 border-2 border-red-500 animate-pulse"
                  : "bg-gold/20 border-2 border-gold hover:bg-gold/30"
              }`}
            >
              {listening ? (
                <MicOff className="w-10 h-10 text-red-400" />
              ) : (
                <Mic className="w-10 h-10 text-gold" />
              )}
              {listening && (
                <span className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping" />
              )}
            </button>
          </div>

          <p className="text-base font-semibold text-foreground mb-2">
            {listening ? "Listening..." : "Tap mic to start"}
          </p>

          {transcript && (
            <p className="text-gold text-sm font-medium mb-4">"{transcript}"</p>
          )}

          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Example commands
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  data-ocid="voice.button"
                  onClick={() => {
                    onCommand(cmd);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-muted-foreground hover:text-foreground hover:border-gold/40 transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
