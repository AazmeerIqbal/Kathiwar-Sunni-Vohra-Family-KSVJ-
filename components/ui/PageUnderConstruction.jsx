export default function PageUnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 text-gray-800">
      <div className="max-w-md w-full text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          🚧 Page Under Construction 🚧
        </h1>
        <p className="text-base sm:text-lg">
          We're working hard to bring you this page soon. Stay tuned!
        </p>
        <div className="mt-4 animate-bounce text-4xl sm:text-5xl">🔧</div>
      </div>
    </div>
  );
}
