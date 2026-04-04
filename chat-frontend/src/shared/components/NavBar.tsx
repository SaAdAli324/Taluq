
import { Link } from "react-router-dom"
const NavBar = () => {
  return (
    <div className=" bg-taluq-green shadow-xl flex py-2">
      <div className="  flex w-full  gap-2 px-2">

        <div className="flex w-full">
          <div className="flex items-center mx-auto justify-center"><h2 className="text-4xl text-white font-medium mx-auto tracking-wide py-4">Taluق</h2></div>
          <div className="flex items-center justify-center">
            <Link className=" flex items-center justify-center cursor-pointer w-full h-full" to="/profile"><div className="border-2 min-w-12 min-h-12 rounded-4xl flex items-center justify-center">
            <img src="" alt="" />
          </div>
          </Link></div>
        </div>
      </div>
    </div>

  )
}

export default NavBar
