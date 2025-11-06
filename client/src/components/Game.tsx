import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Game() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'Guest Unlocked') {
        navigate('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  return(
  <div className="min-h-screen">
      <iframe src="/src/game/game.html" className="w-full h-screen"/>
    </div>
  )
}
