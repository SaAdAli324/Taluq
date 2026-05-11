import { useForm } from 'react-hook-form'
import { profileSchema, type ProfileSchema } from './profileForm.ts'
import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import api from '../../api.ts'
import { useSelector } from 'react-redux'
import { logout } from '../../app/store/slices/authSlices.ts'
import { useDispatch } from 'react-redux'
import { IoClose } from 'react-icons/io5'

const Profile = () => {
    const user = useSelector((state: any) => state.protectRoutes.user)
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            bio: user?.bio || 'yooo'
        },
        values: {
            name: user?.name || '',
            bio: user?.bio || 'yooo'
        }
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const onSubmit = async (data: ProfileSchema) => {
        try {
            await api.put('/api/', data)
            reset(data)
        } catch (error) {
            console.log(error)
        }
    }


    const logOut = async () => {
        try {
            const response = await api.post('/api/auth/logout')
            if (response) {
                dispatch(logout())
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className='border flex flex-col items-center w-full bg-black/70 justify-center h-screen'>

            <div className='relative w-lg max-md:w-full px-2 py-4 rounded-2xl flex flex-col gap-2 items-center justify-center bg-white border-2 border-taluq-green ' >
                <div className="flex justify-between w-full">

                    <span className='text-2xl top-2 right-2 cursor-pointer'><Link to="/home"> <IoClose className="text-xl" /></Link> </span>
                    <button className="logoutBtn" onClick={() => logOut()}>logout</button>

                </div>
                <div className='w-25 h-25 border-2 rounded-full overflow-hidden'>
                    <img src={user?.profilePic ? user.profilePic : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                </div>

                <span className='cursor-pointer text-taluq-green' onClick={() => { fileInputRef.current?.click() }}>change photo</span>
                <span className='text-gray-500 border-b' >id:{user?._id}</span>


                <form onSubmit={handleSubmit(onSubmit)} className='relative w-lg px-2 py-4 rounded-2xl flex flex-col gap-2 items-center justify-center bg-white  '>

                    <input type="file" ref={fileInputRef} className='hidden' />
                    <div className='w-full  space-y-1'>
                        <p className='text-taluq-green mx-auto'>username</p>
                        <input {...register("name")} type="text" className=' rounded-lg px-4 py-2 w-full border' />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>

                    <div className='w-full  space-y-1' >
                        <p className='text-taluq-green'>bio</p>
                        <input {...register("bio")} type="text" className=' rounded-lg px-4 py-2 w-full border' />
                        {errors.bio && <p className='text-red-500'>{errors.bio.message}</p>}
                    </div>
                    <div className='flex gap-4'>
                        <button
                            type='submit'
                            disabled={!isDirty}
                            className={` ${!isDirty ? "px-4 py-2 rounded-lg bg-gray-400 cursor-not-allowed" : "saveBtn"}`}
                        >
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Profile