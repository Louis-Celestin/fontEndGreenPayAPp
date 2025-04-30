// components/ui/loader/Loader.jsx
export default function Loader() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }
  