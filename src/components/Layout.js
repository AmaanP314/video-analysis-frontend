export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">YouTube Video Analysis</h1>
      </header>
      <main className="p-4">{children}</main>
      <footer className="bg-gray-800 p-4 text-center text-sm">
        &copy; {new Date().getFullYear()} YouTube Video Analysis
      </footer>
    </div>
  );
}
