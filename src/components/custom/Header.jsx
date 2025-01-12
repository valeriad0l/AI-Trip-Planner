import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { googleLogout } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  })

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`, {
      header: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload(); 
    })

  }

  return (
    <div className='p-2 shadow-md flex justify-between items-center px-5'>
      <img src='/assets/logo.svg' width={150} />

      <div>
        {user ?

          <div className='flex items-center gap-5'>
            
            <a href="/my-trips">
            <Button variant="outline" className="bg-[#6b493c] text-white rounded  hover:bg-[#805545] hover:text-white hover:border-[#805545] rounded-full">My Trips</Button>
            </a>
            
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className=" h-[35px] w-[35px] rounded-full" />
              </PopoverTrigger>
              <PopoverContent className="bg-white">
                <h2 className="cursor-pointer" onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Log Out</h2>
              </PopoverContent>
            </Popover>

          </div>

          :

          <Button onClick={() => setOpenDialog(true)} className='bg-[#6b493c] text-white rounded  hover:bg-[#805545] hover:text-white hover:border-[#805545]'>Sign In</Button>

        }

        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/assets/logo.svg" width={150} />
                <h2 className='font-bold text-lg mt-5'>Continue with Google Authentication</h2>

                <Button
                  onClick={login}
                  className="w-full mt-5 bg-[#6b493c] text-white hover:border-[#291813] flex gap-2 items-center">

                  <FcGoogle className="w-6" />
                  Sign In With Google

                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

export default Header