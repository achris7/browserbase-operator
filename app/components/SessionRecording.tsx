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

        console.log("API Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Raw response data:", data);

        // Check if we have events data
        if (!data.events || !Array.isArray(data.events) || data.events.length === 0) {
          console.log("No recording events found");
          setError('No recording available for this session');
          return;
        }

        console.log("Received events:", {
          eventCount: data.events.length,
          firstEvent: data.events[0],
          lastEvent: data.events[data.events.length - 1]
        });
        
        if (containerRef.current) {
          console.log("Initializing player with events...");
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          try {
            // Initialize the player
            player = new Player({
              target: containerRef.current,
              props: {
                events: data.events,
                width: 1024,
                height: 576,
                autoPlay: true,
                showController: true,
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

    // Cleanup
    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[576px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[576px] text-red-500">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="w-full aspect-video" />;
} 