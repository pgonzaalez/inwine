import { Link } from "react-router-dom";
export default function App() {

  return (
    <>
      <div>
        <h1>Hello</h1>
        <Link to="/seller/123/products">Go to seller</Link>
        <Link to="/create">Create product</Link>
      </div>
    </>
  )
}


