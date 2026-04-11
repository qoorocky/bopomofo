import { NavLink } from 'react-router-dom';
import { COLORS } from '../../styles/theme';
import { IconHome, IconBook, IconGame, IconTrophy } from '../common/SvgIcons';

interface NavItem {
  label: string;
  to: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { Icon: IconHome,   label: '首頁', to: '/' },
  { Icon: IconBook,   label: '學習', to: '/learn' },
  { Icon: IconGame,   label: '遊戲', to: '/games' },
  { Icon: IconTrophy, label: '成績', to: '/progress' },
];

export default function NavBar() {
  return (
    <nav
      className="no-select"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: COLORS.white,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {NAV_ITEMS.map(({ Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            minWidth: 48,
            padding: '4px 12px',
            color: isActive ? COLORS.primary : COLORS.textLight,
            fontWeight: isActive ? 700 : 400,
            fontSize: '0.7rem',
            textDecoration: 'none',
            touchAction: 'manipulation',
            transition: 'color 0.15s ease',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} color={isActive ? COLORS.primary : COLORS.textLight} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
