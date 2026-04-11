import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/useProgressStore';
import MemoryFlip from '../../components/games/MemoryFlip';

export default function MemoryFlipPage() {
  const navigate = useNavigate();
  const addStars = useProgressStore((s) => s.addStars);
  const updateGameScore = useProgressStore((s) => s.updateGameScore);
  return (
    <MemoryFlip
      onComplete={(stars) => {
        addStars(stars);
        updateGameScore('memory', stars);
        navigate('/games');
      }}
    />
  );
}
