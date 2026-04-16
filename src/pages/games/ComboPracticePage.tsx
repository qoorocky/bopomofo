import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/useProgressStore';
import ComboPractice from '../../components/games/ComboPractice';

export default function ComboPracticePage() {
  const navigate = useNavigate();
  const addStars = useProgressStore((s) => s.addStars);
  const updateGameScore = useProgressStore((s) => s.updateGameScore);
  return (
    <ComboPractice
      onComplete={(stars) => {
        addStars(stars);
        updateGameScore('combo', stars);
        navigate('/games');
      }}
    />
  );
}
