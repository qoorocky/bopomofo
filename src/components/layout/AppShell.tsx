import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function AppShell() {
  return (
    <>
      <main
        style={{
          maxWidth: 600,
          margin: '0 auto',
          minHeight: '100dvh',
          paddingBottom: 72,
          position: 'relative',
        }}
      >
        <Outlet />
      </main>
      <NavBar />
    </>
  );
}
