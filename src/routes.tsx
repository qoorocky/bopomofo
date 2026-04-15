import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';
import ListenAndTapPage from './pages/games/ListenAndTapPage';
import DragAndMatchPage from './pages/games/DragAndMatchPage';
import MemoryFlipPage from './pages/games/MemoryFlipPage';
import TonePracticePage from './pages/games/TonePracticePage';
import StrokeReviewPage from './pages/dev/StrokeReviewPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'learn', element: <LearnPage /> },
        { path: 'games', element: <GamesPage /> },
        { path: 'games/listen', element: <ListenAndTapPage /> },
        { path: 'games/drag', element: <DragAndMatchPage /> },
        { path: 'games/memory', element: <MemoryFlipPage /> },
        { path: 'games/tone', element: <TonePracticePage /> },
        { path: 'progress', element: <ProgressPage /> },
        { path: 'dev/strokes', element: <StrokeReviewPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

export default router;
