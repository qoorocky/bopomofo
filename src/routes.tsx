import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';
import ListenAndTapPage from './pages/games/ListenAndTapPage';
import DragAndMatchPage from './pages/games/DragAndMatchPage';
import MemoryFlipPage from './pages/games/MemoryFlipPage';

const router = createBrowserRouter([
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
      { path: 'progress', element: <ProgressPage /> },
    ],
  },
]);

export default router;
