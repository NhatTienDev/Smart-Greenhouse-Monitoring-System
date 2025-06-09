import { redirect } from 'next/navigation'

import readUserSession, { getDeviceInfo } from '@/actions'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MapInterface } from '@/components/MapInterface'
import { Navbar } from '@/components/Navbar'
import SplineComponent from '@/components/SplineComponent'
import HouseImage from '@/img/The-Future-of-Smart-Farming.jpg'

interface PageProps {
  params: { deviceId: string }
}

export default async function Home({ params }: PageProps) {
  const { data } = await readUserSession()

  if (!data.session) {
    return redirect('/auth')
  }

  return (
    <div className="bg-[linear-gradient(to_top,_#373b44,_#73c8a9)] h-screen relative">
      <div className="absolute inset-0 text-slate-900 flex flex-col">
        <div className="flex flex-col">
          <Navbar deviceId={params.deviceId} />
          <Header />
        </div>

        <div className='flex-1 flex'>
          <div className='flex-1'>
            {/* <SplineComponent /> */}
            <img src={HouseImage.src} alt="Smart Farming" className="w-full h-auto object-cover ml-8" />
          </div>
          <div className='flex-1'><Footer deviceId={params.deviceId} /></div>
        </div>
      </div>
    </div>
  )
}
