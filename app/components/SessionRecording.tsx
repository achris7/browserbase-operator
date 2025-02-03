import { useEffect, useRef, useState } from 'react';
import Player from 'rrweb-player';
import 'rrweb-player/dist/style.css';

interface SessionRecordingProps {
  sessionId: string;
}

export default function SessionRecording({ sessionId }: SessionRecordingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let player: any = null;

    const fetchAndPlayRecording = async () => {
      console.log("Starting to fetch recording for session:", sessionId);
      try {
        setLoading(true);
        
        console.log("Making API request...");
        const response = await fetch(`/api/session?sessionId=${sessionId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
        }

        const events = await response.json();
        console.log("Received events:", {
          eventCount: events.length,
          timeRange: events.length > 0 ? {
            start: new Date(events[0].timestamp).toISOString(),
            end: new Date(events[events.length - 1].timestamp).toISOString(),
            durationMs: events[events.length - 1].timestamp - events[0].timestamp
          } : null
        });

        if (!Array.isArray(events) || events.length === 0) {
          console.log("No recording events found");
          setError('No recording available for this session');
          return;
        }

        if (containerRef.current) {
          console.log("Initializing player with events...");
          containerRef.current.innerHTML = '';
          
          try {
            player = new Player({
              target: containerRef.current,
              props: {
                events: events,
                width: Math.min(1024, window.innerWidth - 48), // Responsive width
                height: Math.min(576, window.innerHeight - 200), // Responsive height
                autoPlay: true,
                showController: true,
                skipInactive: true,
                speedOption: [1, 2, 4, 8],
              },
            });
            console.log("Player initialized successfully");
          } catch (playerError) {
            console.error("Player initialization error:", playerError);
            throw new Error('Failed to initialize player');
          }
        }
      } catch (err) {
        console.error('Detailed error:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err.message : 'Failed to load recording');
      } finally {
        setLoading(false);
      }
    };

    fetchAndPlayRecording();

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center" />;
} 