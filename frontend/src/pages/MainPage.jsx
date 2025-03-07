import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hello</h1>
        <Link 
          to="/seller/123/products" 
          className="block bg-blue-500 text-white py-2 px-4 rounded-md my-2 transition duration-300 hover:bg-blue-700"
        >
          Go to seller
        </Link>
        <Link 
          to="/create" 
          className="block bg-green-500 text-white py-2 px-4 rounded-md my-2 transition duration-300 hover:bg-green-700"
        >
          Create a product
        </Link>
        <Link 
          to="/register" 
          className="block bg-purple-500 text-white py-2 px-4 rounded-md my-2 transition duration-300 hover:bg-purple-700"
        >
          Registra un Productor
        </Link>
      </div>
    </div>
  );
}
