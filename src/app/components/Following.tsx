"use client"
import { Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { revalidateTag } from 'next/cache';
import React from 'react'


const Following = ({ userId, FollowingUser }: { userId: string, FollowingUser: string }) => {
    const { data: session, update, status } = useSession();



    const handleFollow = async (userId: string, FollowingUser: string, isFollow: boolean,e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault();
            const response = await fetch(`http://localhost:3000/api/User/${userId}/following`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        userId: FollowingUser,
                        following: !isFollow
                }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            } else {

                const data = await response.json();
                console.log({data});
                update({
                    ...session,
                    user: {
                        ...session?.user,
                        follwing: data?.user?.follwing,
                    }
                })
                // Update local state or revalidate cached data here (if applicable)

                revalidateTag("user"); // Revalidate cache tag
            }

        } catch (error) {
            console.error("Error liking post:", error); // Handle errors gracefully
        }
    }
    if (status === "authenticated") {

        const isFollow: boolean = session.user.follwing.find((follow: any) => follow?.userId === FollowingUser) ? true : false
        return (

            <button
                onClick={(e) => handleFollow(userId, FollowingUser, isFollow,e)}
                name="btn-Following"
                className={`${isFollow ? "bg-gray-300" : "bg-[#1877F2] text-white"} hover:bg-gray-500 py-1 px-5 rounded-md`}>
                {
                    isFollow ?
                        "Following" :
                        "Follow"
                }</button>
        )


    }else if(status==="loading"){
        return (

            <button
                
                className={`bg-[#1877F2] text-white hover:bg-gray-500 py-1 px-5 rounded-md`}>
                        <Spin size='large'/>
                </button>
        )
        

    }else{
        return (

            <button
                
                className={`bg-[#1877F2] text-white hover:bg-gray-500 py-1 px-5 rounded-md`}>
                         Follow
                </button>
        )
    }
}

export default Following