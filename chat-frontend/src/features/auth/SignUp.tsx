import { signUpSchema, type SignUpSchema } from "./authSchema/signUpForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router";
import api from "../../api";
import { useDispatch } from "react-redux";
import { login } from "../../app/store/slices/authSlices";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit =async (data: SignUpSchema) => {
        console.log(data)
        try {
            const response = await api.post("/api/auth/signup",data)
            console.log(response.data);
                dispatch(login(response.data.user));
                  navigate("/home");
        } catch (error:any) {
            console.log(error.response.data.message);
            
        }
    }
    return (
        <div className="bg-black/70 w-full h-screen flex items-center justify-center">

            <form onSubmit={handleSubmit(onSubmit)} className="flex   px-4 py-8 rounded-2xl w-sm bg-white text-black flex-col gap-4">
                <h2 className="text-center text-taluq-green font-bold text-xl">SignUp</h2>

                <div>
                    <input
                        {...register("name")}
                        placeholder="Name"
                        className="w-full  border border-gray-600 p-2 rounded focus:border-taluq-green outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
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

                <button type="submit" className="bg-taluq-green text-gray-900  py-2 rounded">
                    Sign Up
                </button>
                <p> already have an account?<Link to="/login" className="text-taluq-green cursor-pointer">Login</Link></p>
            </form>

        </div>
    );
};

export default SignUp
