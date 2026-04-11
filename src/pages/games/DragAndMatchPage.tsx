import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/useProgressStore';
import DragAndMatch from '../../components/games/DragAndMatch';

export default function DragAndMatchPage() {
  const navigate = useNavigate();
  const addStars = useProgressStore((s) => s.addStars);
  const updateGameScore = useProgressStore((s) => s.updateGameScore);
  return (
    <DragAndMatch
      onComplete={(stars) => {
        addStars(stars);
        updateGameScore('drag', stars);
        navigate('/games');
      }}
    />
  );
}
