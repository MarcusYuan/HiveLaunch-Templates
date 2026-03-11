import { useSettingsStore } from '@/stores/settingsStore';

export default function App() {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="w-80 p-4">
      <h1 className="text-xl font-bold mb-4">{{DISPLAY_NAME}}</h1>
      
      <div className="space-y-4">
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
        
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Action
        </button>
      </div>
    </div>
  );
}
