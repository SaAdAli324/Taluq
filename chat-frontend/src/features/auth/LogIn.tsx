import { logInSchema , type LoginSchema } from "./authSchema/logInForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.ts";
import { useDispatch } from "react-redux";
import { login } from "../../app/store/slices/authSlices.ts";


const LogIn = () => {

    const {register , handleSubmit , formState:{errors}}= useForm<LoginSchema>({
        resolver: zodResolver(logInSchema)
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSubmit = async (data:LoginSchema) => {
        console.log(data)
        try {
            const response = await api.post("/api/auth/login",data)
            console.log(response.data)
            dispatch(login(response.data.user)) 
            navigate("/home")
            
        } catch (error) {
            navigate("/login")
            console.log(error);
            
        }
    }


  return (
     
       <div className="bg-black/70 w-full h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex   px-4 py-8 rounded-2xl  w-sm bg-white flex-col gap-4">
            <h2  className="text-center text-taluq-green font-bold text-xl">Log In</h2>
         
            <div>
                <input
                    {...register("email")}
                    placeholder="Email"
                    className="w-full  border border-gray-600 p-2 rounded focus:border-taluq-green outline-none"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
                <input
                    {...register("password")}
                    placeholder="Password"
                    className="w-full  border border-gray-600 p-2 rounded focus:border-taluq-green outline-none"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
           
            <button type="submit" className="bg-taluq-green text-gray-900 py-2 rounded">
                Log in
            </button>
           <p> don't have an account?<Link to="/signup" className="text-taluq-green cursor-pointer"> Sign Up</Link></p>
        </form>
</div>
 
  )
}

export default LogIn

