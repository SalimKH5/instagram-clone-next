"use client"
import { revalidateTag } from 'next/cache';
import React, { useEffect, useState } from 'react'

import { BsFillSaveFill } from "react-icons/bs";
import { SessionProvider, useSession } from 'next-auth/react';
import { BsSave } from "react-icons/bs";
import api from "../ApiConfig"
interface SavePost{
    userId:string
    postId:string
    
}







const SavePost = ({userId,postId}:SavePost) => {

  const {data:session,update,status}=useSession();
  const [saveP,setSaveP]=useState<boolean>(false);
 
  useEffect(()=>{
    if(status==="authenticated"){
          if(session?.user?.saveposts.find((savepost:any)=>savepost?.postId?._id===postId)){
            setSaveP(true)
          }
    }
  },[status])

  const handeSavePost=async ()=>{
      try {
        const result=await fetch(api.User+userId,{
          method:"PUT",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            postId:postId,
            savePost:!saveP
          })
        })
      
        if(result.ok){
          
          const data=await result.json();
          update({
            ...session,
            user: {
              ...session?.user,
              saveposts:data?.user?.saveposts
            }
          })

          if(data?.user?.saveposts.find((savepost:any)=>savepost?.postId._id===postId)){
            setSaveP(true)
          }else{
            setSaveP(false);
          }
        }

      } catch (error) {
        console.error({error});
      }
  }

  
  return (
    saveP?
    <BsFillSaveFill 
    
    onClick={()=>handeSavePost()}
    size={25} className="cursor-pointer hover:scale-105 hover:text-[#adadad]" />
    :
    <BsSave
    onClick={()=>handeSavePost()}
    size={25} className="cursor-pointer hover:scale-105 hover:text-[#4e4e4e]" />
    

  )
}

export default SavePost