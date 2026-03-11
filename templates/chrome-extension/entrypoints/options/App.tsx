import { useSettingsStore } from '@/stores/settingsStore';

export default function App() {
  const { theme, notifications, setTheme, setNotifications } = useSettingsStore();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{{DISPLAY_NAME}} - Settings</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="w-full p-2 border rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Enable Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
}
