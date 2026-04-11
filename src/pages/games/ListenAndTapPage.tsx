import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/useProgressStore';
import ListenAndTap from '../../components/games/ListenAndTap';

export default function ListenAndTapPage() {
  const navigate = useNavigate();
  const addStars = useProgressStore((s) => s.addStars);
  const updateGameScore = useProgressStore((s) => s.updateGameScore);
  return (
    <ListenAndTap
      onComplete={(stars) => {
        addStars(stars);
        updateGameScore('listen', stars);
        navigate('/games');
      }}
    />
  );
}
