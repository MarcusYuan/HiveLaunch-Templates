export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-700">
            This is a template for a fullstack monorepo application.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">Next.js 15 + React 19</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-2">Backend</h3>
            <p className="text-sm text-gray-600">Hono + tRPC</p>
          </div>
        </div>
      </div>
    </main>
  );
}
