"use client"
import Image from 'next/image'
import { IoHome } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { RxVideo } from "react-icons/rx";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { signOut } from "next-auth/react"
import { ChangeEvent, useState } from 'react';
import {Modal } from 'antd';
import { FaPhotoVideo } from "react-icons/fa";

type ItemNavigation={
    text:string,
    icon:any,
    path:string,
    type:number
  }
 

interface UploadPost{
  filePath:File|null,
  postTitle:string   
}


  
const Sidebar = ({ token }: { token: string | undefined }) => {
    const naigations_Items:ItemNavigation[]=[
        {
          text:"Home",
          icon:<IoHome width={150}/>,
          path:"/Home",
          type:0,
        },
        {
          text:"Search",
          icon:<CiSearch width={150}/>,
          path:"/Search",
          type:0,
        },
        {
          text:"Explore",
          icon:<MdOutlineExplore width={150}/>,
          path:"/Explore",
          type:0,
        },
        {
          text:"Reel",
          icon:<RxVideo width={150}/>,
          path:"/Reel",
          type:0,
        },
        {
          text:"Messages",
          icon:<AiOutlineMessage width={150}/>,
          path:"/Messages",
          type:0,
        },
        {
          text:"Create",
          icon:<IoMdAddCircleOutline width={150}/>,
          path:"/Create",
          type:1,
        },
        {
          text:"Notifications",
          icon:<CiHeart width={150}/>,
          path:"/Notifications",
          type:0,
        },
    ]

      const [isModalOpen, setIsModalOpen] = useState(false);
     
      const [formData,setFormData]=useState<UploadPost>({
        filePath:null,
        postTitle:""
      });
      const [imageDipslay,setFormDataDisplay]=useState<string|undefined>();

      const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };
    


      const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
              setFormDataDisplay(event.target.result);
            }
          };
          reader.readAsDataURL(file);
          setFormData((prev:UploadPost)=>({
            ...prev,
            filePath:file
          }))
        }
      };

      const handleSubmit=async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        try{
          if(formData.filePath &&  formData.postTitle){
            const fd=new FormData();
            fd.append('file', formData.filePath); // Assuming 'logo' is the key for your file
            fd.append('postTitle', formData.postTitle); // Assuming 'logo' is the key for your file
          const result =await fetch('http://localhost:3000/api/post/',{
            method:"POST",
            headers:{
              Authorization: `Bearer ${token}`, // Fix typo in 'Authorization'
            },
            body:fd
          })
          if(result.ok){
            console.log("great you upload a file")
          }else{
            console.log("bad did't  upload a the file succesfully");

          }
          }
            

        }catch(error){

        }


      }
     

    
  return (
    <div className="w-full flex items-center lg:items-start flex-col gap-8 px-4 py-4">
                  <Image onClick={() => signOut()} src="/instagram-logo-1-1024x366.svg" className='hidden cursor-pointer lg:inline' alt="" width={120} height={80}/>
                  <Image src="/instagram-logo.png" className='inline lg:hidden' alt="" width={30} height={30}/>
                  <div className="w-full flex flex-col gap-4 px-2">
                        {
                          naigations_Items.map((item:ItemNavigation,index:number)=>(
                            <div 
                            onClick={()=>{
                                if(item.type===1){
                                  showModal();
                                }
                              }
                            } 
                            key={index} className="w-full flex text-2xl items-center gap-3 px-2 rounded-xl cursor-pointer py-2 hover:bg-[#e7e7e7]">
                                  {item.icon}
                                  <h1 className='hidden lg:inline text-base '>{item.text}</h1>

                            </div>
                          ))
                        }
                  </div>
                  <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}  >
                          <div  className="w-full min-h-72 flex items-center flex-col justify-center cursor-pointer">
                                  {formData.filePath ?
                                  <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                          <img src={imageDipslay} alt="Selected" style={{ maxWidth: '100%' }} />
                                          <div className="w-full flex flex-col gap-5">
                                          <textarea 
                                                value={formData.postTitle} 
                                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                                                  setFormData((prev: UploadPost) => ({
                                                    ...prev,
                                                    postTitle: e.target.value,
                                                  }))
                                                } 
                                                rows={6} 
                                                className='w-full p-2' 
                                                placeholder='écrivez un poste'
                                              ></textarea>

                                                      <button className='bg-blue-800 text-white'>Post</button>
                                              </div>
                                  </form>
                                    :
                                    <>
                                      <FaPhotoVideo size={130}/>
                                      <input type="file" accept="image/*" onChange={handleFileSelect} />  
                                      </>                                            
                                    
                                  }
                          </div>
                  </Modal>
          </div>
  )
}

export default Sidebar