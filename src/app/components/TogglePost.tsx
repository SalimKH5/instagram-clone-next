"use client"
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import Image from 'next/image';
import PostHeader from './PostHeader';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { revalidateTag } from 'next/cache';
import { useRouter } from 'next/navigation';

import { FaRegComment } from "react-icons/fa6";
import CommentAction from './CommentAction';
import Api from "../ApiConfig"
const TogglePost = ({ toggle,userId,comments, src,title,postby,postId }: {toggle:React.ReactNode, userId:string,comments: any[], src: string,title:string,
    postby:{
        _id: string,
        username: string,
    },postId:string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

   

    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            // Click occurred outside the modal content, so close the modal
            handleModalClose();
        }
    };
    

    useEffect(() => {
        // Attach event listener when modal opens
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        // Remove event listener when modal closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const [likeComments,setLikeComments]=useState<any>(
        [
        ]
    );

    useEffect(() => {
       comments.map((comment: any) => {
            
      
            if(comment.likes.find((like:any)=>like.userId===userId)){
               
                setLikeComments((prev:any)=>[...prev,{
                    commentId:comment._id,
                }])
            }
        });
        
        
    }, [isModalOpen]);

    
    const handleLikeComment=async(commentId:string,liked:boolean)=>{
        try {
            const result=await fetch(`${Api.posts+postId}/likeComment`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(
                    {
                    comment_id:commentId,
                    userId:userId,
                    liked:liked
                  })
            })


            if(result.ok){
                const data=await result.json();
                if(liked){
                    setLikeComments((prev:any)=>[...prev,{
                        commentId:commentId,
                    }])
                }else{
                    setLikeComments((prev:any)=>{
                       const likecomment=prev.filter((like:any)=>like.commentId!==commentId)
                        return likecomment
                    })
                }
                router.refresh()
                revalidateTag("posts"); // Revalidate cache tag
            }
        } catch (error) {
                console.log({error});
        }
    }


    return (
        <>
        {<div onClick={showModal}>{toggle}</div>}
          

            {isModalOpen && (
                <div  className="fixed inset-0 bg-[#0000005b] flex items-center p-8 lg:p-16 justify-center z-[1000]">
                    <div ref={modalRef}  className='w-full h-full rounded-xl bg-white flex flex-row'>
                        <div className=" lg:flex-[0.3] hidden lg:flex aspect-video relative bg-[#00005]">
                            <Image src={`/assets/${src}`} alt="" fill className='object-cover rounded-l-xl h-full w-full ' />
                        </div>
                        <div className="w-full lg:flex-[0.7] overflow-y-auto bg-white flex flex-col py-3 px-6 rounded-r-xl gap-4">
                             <PostHeader username={postby.username} />
                             <hr />
                            <div className="w-full flex gap-3">
                                <h1 className='font-bold  uppercase'>{postby.username}</h1>
                                <h1>{title}</h1>
                            </div>
                           
                            {comments?.map((comment, index) => (
                                <div className="w-full flex justify-between gap-2" key={index}>
                                    <div className="w-full flex flex-col gap-1">
                                            <div className="w-full flex gap-2">
                                                <p className='font-bold text-lg'>{comment.userId.username}</p>
                                                <p className='w-full'>{comment.TextComment}</p>
                                            </div>
                                            <div className="w-full flex gap-3 items-center text-sm">
                                                <p className='text-gray-400 hover:text-gray-300 cursor-pointer '>{comment.likes.length} likes</p>
                                            </div>       
                                    </div>
                                   
                                    {
                                        likeComments.find((likeComment:any)=>likeComment.commentId===comment._id)?
                                        <FaHeart  
                                        onClick={()=>handleLikeComment(comment._id,false)}
                                        size={25}  className="cursor-pointer text-red-600" />
                                         :
                                        <CiHeart   
                                        onClick={()=>handleLikeComment(comment._id,true)}
                                        size={20}   className="cursor-pointer font-bold hover:text-[#adadad]" />

                                    }
                                </div>
                            ))}
                            <hr/>
                            <CommentAction
                            postId={postId}
                            userId={userId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TogglePost;
