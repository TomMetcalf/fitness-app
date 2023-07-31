import Switch from 'react-switch';

export default function LightModeToggle({ toggleTheme, theme }) {
  return (
    <div className="switch">
      <label> {theme === 'light' ? 'Light' : 'Dark'}</label>
      <Switch
        onChange={toggleTheme}
        checked={theme === 'dark'}
        onColor="##424242"
        offColor="#fff"
        offHandleColor="#1aac83"
        onHandleColor="#1aac83"
        checkedIcon={
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
              color: 'white',
            }}
            class="material-symbols-outlined"
          >
            dark_mode
          </span>
        }
        uncheckedIcon={
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
            }}
            class="material-symbols-outlined"
          >
            light_mode
          </span>
        }
      />
    </div>
  );
}