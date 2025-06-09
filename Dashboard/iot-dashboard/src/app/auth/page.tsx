
import React from 'react'
import { AuthForm } from '../../components/forms/AuthForm'
// import readUserSession from '@/actions'
import { redirect } from 'next/navigation'
import { Icons } from '@/components/icons'
import SplineComponent from '@/components/SplineComponent'
import { House } from 'lucide-react'

export default async function page() {
  // const { data } = await readUserSession()
  // if (data.session) {
  //   return redirect('/')
  // }
  // return (
  //   <>
  //     <>
  //       <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
  //         <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
  //           <div className="absolute inset-0 bg-[linear-gradient(109.6deg,_rgba(34,126,34,1)_11.2%,_rgba(99,162,17,1)_91.1%)]" />
  //           <div className="relative z-20 flex items-center text-lg font-medium gap-1">
  //             <House className="h-10 w-10" />
  //             Smart Greenhouse Monitor
  //           </div>
  //           <div className="relative z-20 mt-auto">
  //             {/* <div className="pointer-events-none touch-none overscroll-none absolute top-[-745px] w-[35vw] h-[50vh]"
  //               onWheel={(e) => e.preventDefault()}
  //               onTouchMove={(e) => e.preventDefault()}><SplineComponent /></div> */}
  //             <blockquote className="space-y-2">
  //               <p className="text-lg">
  //                 &ldquo;Get real-time seawater quality updates with our advanced monitoring system in Xuan Dai Bay, Phu Yen Province, ensuring you stay informed about key water conditions and make timely decisions to protect the marine environment.&rdquo;
  //               </p>
  //               <footer className="text-sm pt-3">
  //                 Made with ♡ by Nghia Ngo
  //               </footer>
  //             </blockquote>
  //           </div>
  //         </div>
  //         <div className="lg:p-8">
  //           <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
  //             <div className="flex flex-col space-y-2 text-center">
  //               <h1 className="text-2xl font-semibold tracking-tight">
  //                 Welcome back!
  //               </h1>
  //               <p className="text-sm text-muted-foreground">
  //                 Please enter your credentials to log in. New here? You can
  //                 also register.
  //               </p>
  //               <AuthForm />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   </>
  // )
  return (
    // 1. Dùng min-h-screen để chiếm toàn bộ chiều cao, và flex items-center justify-center để căn form giữa
    <div
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center

        /* Background gradient toàn màn hình */
        bg-[linear-gradient(91deg,_rgba(72,154,78,1)_5.2%,_rgba(251,206,70,1)_95.9%)]

        /* Bạn có thể thêm padding hoặc gap nếu muốn */
        p-4
        gap-5
      "
    >
      {/* 2. Container của form */}
      <div
        className="
          w-full
          max-w-md            /* giới hạn độ rộng của form, ví dụ tối đa 400px ~ 320px-384px */
          bg-white/90         /* background trắng hơi mờ để thấy 1 phần nền gradient phía sau */
          backdrop-blur-sm    /* (tùy chọn) giả lập kính mờ cho form nổi bật hơn */
          rounded-lg
          shadow-lg
          p-8
        "
      >
        {/* 3. Phần logo hoặc tiêu đề (nếu muốn) đặt lên trên form */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="flex items-center text-2xl font-semibold bg-[linear-gradient(91deg,_rgba(72,154,78,1)_5.2%,_rgba(251,206,70,1)_95.9%)] bg-clip-text text-transparent gap-2">
            <House className="h-8 w-8 text-green-600" />
            <span>Smart Greenhouse Monitor</span>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Please enter your credentials to log in.
            <br />
            New here? You can also register.
          </p>
        </div>

        {/* 4. Phần AuthForm (Sign In / Register tabs + input + button) */}
        <AuthForm />
      </div>

      <blockquote className="max-w-xl text-center space-y-2">
        <p className="text-lg italic">
          &ldquo;Get real-time data collections from IOT sensors with our advanced monitoring system
          in Ho Chi Minh University of Technology, ensuring you stay informed about greenhouse
          conditions and make timely decisions to cultivation.&rdquo;
        </p>
        <footer className="mt-4 text-sm">
          Made with ♡ by Nghia Ngo
        </footer>
      </blockquote>
    </div>
  )
}
