import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export function Home() {
  const [greeting, setGreeting] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const result = await invoke<string>('greet', { name: '{{DISPLAY_NAME}}' });
        setGreeting(result);
      } catch (error) {
        console.error('Failed to fetch greeting:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGreeting();
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {{DISPLAY_NAME}}
        </h1>
        <p className="mt-2 text-gray-600">
          {isLoading ? 'Loading...' : greeting}
        </p>
      </div>
    </div>
  );
}
