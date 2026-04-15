import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/useProgressStore';
import TonePractice from '../../components/games/TonePractice';

export default function TonePracticePage() {
  const navigate = useNavigate();
  const addStars = useProgressStore((s) => s.addStars);
  const updateGameScore = useProgressStore((s) => s.updateGameScore);
  return (
    <TonePractice
      onComplete={(stars) => {
        addStars(stars);
        updateGameScore('tone', stars);
        navigate('/games');
      }}
    />
  );
}
