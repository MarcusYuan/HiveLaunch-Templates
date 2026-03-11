import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';

export function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { setOnboarded } = useAppStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <button
            onClick={() => setOnboarded(false)}
            className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Reset Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
