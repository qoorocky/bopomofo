import { useAudioSettingsStore } from '../../stores/useAudioSettingsStore';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconSpeakerOn, IconSpeakerOff, IconMusic } from './SvgIcons';

export default function AudioSettingsPanel() {
  const bgmEnabled = useAudioSettingsStore((s) => s.bgmEnabled);
  const sfxEnabled = useAudioSettingsStore((s) => s.sfxEnabled);
  const masterVolume = useAudioSettingsStore((s) => s.masterVolume);
  const toggleBgm = useAudioSettingsStore((s) => s.toggleBgm);
  const toggleSfx = useAudioSettingsStore((s) => s.toggleSfx);
  const setMasterVolume = useAudioSettingsStore((s) => s.setMasterVolume);

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    borderRadius: BORDER_RADIUS.lg,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 700,
    touchAction: 'manipulation',
    transition: 'background-color 0.15s, color 0.15s',
    backgroundColor: active ? COLORS.primary : '#F0F0F0',
    color: active ? COLORS.white : '#888',
    width: '100%',
    justifyContent: 'flex-start',
  });

  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: SHADOW.lg,
        padding: 16,
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.textLight, letterSpacing: '0.05em', marginBottom: 2 }}>
        音效設定
      </div>

      {/* BGM toggle */}
      <button style={toggleStyle(bgmEnabled)} onClick={toggleBgm} aria-label="Toggle background music">
        <IconMusic size={18} color={bgmEnabled ? COLORS.white : '#AAA'} />
        背景音樂 {bgmEnabled ? '開' : '關'}
      </button>

      {/* SFX toggle */}
      <button style={toggleStyle(sfxEnabled)} onClick={toggleSfx} aria-label="Toggle sound effects">
        {sfxEnabled
          ? <IconSpeakerOn size={18} color={COLORS.white} />
          : <IconSpeakerOff size={18} color="#AAA" />
        }
        音效 {sfxEnabled ? '開' : '關'}
      </button>

      {/* Master volume */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: '0.8rem', color: COLORS.textLight, marginBottom: 6, fontWeight: 600 }}>
          音量
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: COLORS.primary, cursor: 'pointer' }}
          aria-label="Master volume"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#CCC', marginTop: 2 }}>
          <span>靜音</span>
          <span>最大</span>
        </div>
      </div>
    </div>
  );
}
