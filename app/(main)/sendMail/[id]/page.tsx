"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import supabaseClient from '@/lib/supabase';
import { useAuth, useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Page() {
  const {getToken} = useAuth();
  const user = useUser();
  const {toast} = useToast();
  const params = useParams();
  const router = useRouter();
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [subject, setSubject] = useState('');

  async function handleClick(){
    try {
      const token = await getToken({template:"supabase"});
        const supabase = supabaseClient(token);
        const {error} = await supabase.functions.invoke("sendEmail",{
          body:{
            from:user.user?.primaryEmailAddress,
            to:to,
            subject,
            html:value
          }
        })
        if(error){
          throw error;
        }
      router.push("/students");
    } catch (error) {
      console.log(error)
      toast({
        title:"Something went wrong",
      })
    }
  }

  useEffect(()=>{
    async function getTo(){
      try {
        const token = await getToken({template:"supabase"});
        const supabase = supabaseClient(token);
        const {data,error} = await supabase.from("students").select("*").eq("id",params.id);
        if(error){
          throw error;
        }
        setTo(data[0].email||"");
      } catch (error) {
        console.log(error)
        toast({
          title:"Something went wrong",
        })
      }
    }
    getTo()
  },[params.id,getToken,toast])
  return (
    <div className='w-full mx-3 my-5 md:my-0'>
      <div className='my-2'>
        <Label htmlFor='to'>To:</Label>
        <Input id='subject' value={to} disabled/>
        <Label htmlFor='subject'>Subject</Label>
        <Input id='subject' value={subject} onChange={e=>setSubject(e.target.value)}/>
      </div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <div className='flex items-center justify-end m-5'>
        <Button onClick={handleClick}>
          Send
        </Button>
      </div>
    </div>
  )
}