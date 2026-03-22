
import { useForm } from 'react-hook-form'

import { profileSchema, type ProfileSchema } from './profileForm.ts'
import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api.ts'
import { any } from 'zod'
const Profile = () => {
    interface userInfo {
        _id:string | null,
        name:string | null,
        email:string | null,
        bio:string | null,
        photo:string | null
    }
    const [userProfile , setUserProfile]= useState<userInfo>({
        name:null,
        _id:null,
        email:null,
        bio:null,
        photo:null
    })
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema)
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const onSubmit =async (data: ProfileSchema) => {
      
    }
    useEffect(()=>{
        const getProfile =async ()=>{
  try {
            const response = await api.get('api/get/profile',{
                withCredentials:true
            })
            console.log(response.data.user)
            setUserProfile(response.data.user)

        } catch (error) {
            console.log(error)
        }
        }
        getProfile()
    },[])

    const logOut = async()=>{
        try {
            const response =await api.post('api/auth/logout')
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='border flex items-center w-full bg-black/70 justify-center h-screen'>
            <form onSubmit={handleSubmit(onSubmit)} className='relative w-lg px-2 py-4 rounded-2xl flex flex-col gap-2 items-center justify-center bg-white border-2 border-taluq-green '>
                <span className='absolute text-2xl top-2 right-2 cursor-pointer'><Link to="/home">x</Link> </span>
                <div className='w-25 h-25 border rounded-full'>
                    <img src="" alt="" />
                </div>
                
                <span className='cursor-pointer text-taluq-green' onClick={() => { fileInputRef.current?.click() }}>change photo</span>
               
                <input type="file" ref={fileInputRef} className='hidden' />
               <span className='text-gray-500 border-b' >id:{userProfile._id}</span>
                <div className='w-full  space-y-1'>
                    <p className='text-taluq-green mx-auto'>username</p>
                    <input {...register("name")} type="text" defaultValue={userProfile.name!} className=' rounded-lg px-4 py-2 w-full' />
                    {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                </div>

                <div className='w-full  space-y-1' >
                    <p className='text-taluq-green'>bio</p>
                    <input {...register("bio")} type="text" defaultValue={"yooo"} className=' rounded-lg px-4 py-2 w-full' />
                    {errors.bio && <p className='text-red-500'>{errors.bio.message}</p>}
                </div>
                <div className='flex gap-4'>
                    <button type='submit' className='bg-taluq-green text-white px-4 py-2 rounded-lg'>Save</button>
            <button className='bg-red-500 text-white px-4 py-2 rounded-lg' onClick={()=> logOut()}>Logout</button>
                
                </div>


            </form>
        </div>
    )
}

export default Profile