'use client'
import { useEffect, useRef, useState } from 'react'
import { Card } from './Card'
import { Icons } from './icons'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  Parallax
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { addNotification, getDeviceInfo, getRanges, getTasks, getTelemetryTb, sendDataTb, updateTask, updateTaskStatus } from '@/actions'
import { toast, useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js'
import { useTelemetry } from './context/TelemetryProvider'
import { useGetUserSB } from '@/hooks/useGetUserSB'
import { AlertSensor } from './AlertSensor'
import { Threshold } from './AlertSensorSpecific'
import SplineComponent from './SplineComponent'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ExecutedCronjob = {
  id: string,
  cron: string,
  executed: boolean
}

const fireAlert = async (value: number, minValue: number, maxValue: number, deviceName: string, deviceId: string, sensor: string) => {
  // console.log('value >>>', value)
  // console.log('min value >>>', rangeObj.minValue)

  // console.log('max value >>>', rangeObj.maxValue)
  value = Number(value).toFixed(2) as number
  const data: any = {
    deviceId,
    sensor,
    value,
    deviceName
  }

  if (value < minValue) {
    data['minValue'] = minValue
    data['condition'] = 'lower'
    data['content'] = `Your predicted_${sensor} value is less than min value (${value} < ${minValue})`
    await addNotification(data)
    toast({
      variant: "destructive",
      title: `⚠️ Uh oh! predicted_${sensor} value is out of range`,
      description: `Your predicted_${sensor} value is less than min value (${value} < ${minValue})`
    })
  } else if (value > maxValue) {
    data['maxValue'] = maxValue
    data['condition'] = 'higher'
    data['content'] = `Your predicted_${sensor} value is more than max value (${value} > ${maxValue})`
    await addNotification(data)
    toast({
      variant: "destructive",
      title: `⚠️ Uh oh! predicted_${sensor} value is out of range`,
      description: `Your predicted_${sensor} value is more than max value (${value} > ${maxValue})`
    })
  }
}

export function Footer({ deviceId }: { deviceId: string }) {
  // const [pH, setPH] = useState<SensorData[]>([])
  // const [ORP, setORP] = useState<SensorData[]>([])
  // const [TUR, setTUR] = useState<SensorData[]>([])
  // const [EC, setEC] = useState<SensorData[]>([])

  const { temp, humid, soil, predictedTemp, predictedHumid, predictedSoil, pH, ORP, EC, TUR, predictedPH, predictedORP, predictedTUR, predictedEC, executed_cronjob } = useTelemetry()

  const tempThreshHold: Threshold = {
    good: [28, 32],
    monitorDist: 2,
    riskDist: 5,
    severeDist: Infinity,
  }

  const humidThreshHold: Threshold = {
    good: [50, 90],
    monitorDist: 10,
    riskDist: 20,
    severeDist: Infinity,
  }

  const soilThreshHold: Threshold = {
    good: [25, 70],
    monitorDist: 15,
    riskDist: 25,
    severeDist: Infinity,
  }

  const phThreshHold: Threshold = {
    good: [20, 35],
    monitorDist: 0.3,
    riskDist: 0.8,
    severeDist: 4.2,
  }

  const orpThreshHold: Threshold = {
    good: [50, 90],
    monitorDist: 50,
    riskDist: 100,
    severeDist: Infinity,
  }

  const ecThreshHold: Threshold = {
    good: [40000, 60000],
    monitorDist: 5000,
    riskDist: 10000,
    severeDist: Infinity,
  }

  const turThreshHold: Threshold = {
    good: [25, 70],
    monitorDist: 5,
    riskDist: 10,
    severeDist: Infinity,
  }


  const token = global?.window?.localStorage.getItem('token') ?? ''
  const res = useGetUserSB()
  const userId = res.userInfo?.session.user.id

  const [switchState, setSwitchState] = useState<boolean>(false)
  const prevSwitchState = useRef<boolean>()

  const handleSwitch = (checked: boolean) => {
    prevSwitchState.current = switchState
    setSwitchState(checked)
  }

  useEffect(() => {
    const handleAlert = async () => {

      const { name } = await getDeviceInfo(deviceId, token)

      const { data: dataPH } = await getRanges('pH', deviceId)
      const { data: dataTUR } = await getRanges('TUR', deviceId)
      const { data: dataORP } = await getRanges('ORP', deviceId)
      const { data: dataEC } = await getRanges('EC', deviceId)

      const { data: dataTemp } = await getRanges('temp', deviceId)
      const { data: dataHumid } = await getRanges('humid', deviceId)
      const { data: dataSoil } = await getRanges('soil', deviceId)


      if (dataPH?.length > 0) {
        fireAlert(predictedPH.at(predictedPH.length - 1)?.value as number, dataPH?.[0].minValue, dataPH?.[0].maxValue, name, deviceId, 'pH')
      }

      if (dataORP?.length > 0) {
        fireAlert(predictedORP.at(predictedORP.length - 1)?.value as number, dataORP?.[0].minValue, dataORP?.[0].maxValue, name, deviceId, 'ORP')
      }

      if (dataTUR?.length > 0) {
        fireAlert(predictedTUR.at(predictedTUR.length - 1)?.value as number, dataTUR?.[0].minValue, dataTUR?.[0].maxValue, name, deviceId, 'TUR')
      }

      if (dataEC?.length > 0) {
        fireAlert(predictedEC.at(predictedEC.length - 1)?.value as number, dataEC?.[0].minValue, dataEC?.[0].maxValue, name, deviceId, 'EC')
      }

      if (dataTemp?.length > 0) {
        fireAlert(predictedTemp.at(predictedTemp.length - 1)?.value as number, dataTemp?.[0].minValue, dataTemp?.[0].maxValue, name, deviceId, 'temp')
      }

      if (dataHumid?.length > 0) {
        fireAlert(predictedHumid.at(predictedHumid.length - 1)?.value as number, dataHumid?.[0].minValue, dataHumid?.[0].maxValue, name, deviceId, 'humid')
      }

      if (dataSoil?.length > 0) {
        fireAlert(predictedSoil.at(predictedSoil.length - 1)?.value as number, dataSoil?.[0].minValue, dataSoil?.[0].maxValue, name, deviceId, 'soil')
      }
    }

    handleAlert()
  }, [pH, ORP, EC, TUR, temp, humid, soil])

  supabase
    .channel('custom-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'tasks' },
      (payload) => {
        if (payload.new.status === 'success') {
          // if (payload.new.trigger_type === 'true') {
          //   handleSwitch(true)
          // } else {
          //   handleSwitch(false)
          // }

          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-white">Task Done Successfully: pumpStatus ---- ${payload.new.trigger_type === 'true' ? 'ON' : 'OFF'}</p>
              </pre>
            ),
          })
        }
      }
    )
    .subscribe();

  useEffect(() => {
    const getStatusSwitch = async () => {
      try {
        const token = JSON.parse(JSON.stringify(localStorage.getItem('token')))
        const data = await getTelemetryTb(deviceId, token, ['pumpStatus'])

        if (data.pumpStatus[0].value && data?.pumpStatus.length > 0) {
          setSwitchState(data.pumpStatus[0].value === '0' ? false : true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getStatusSwitch()
  }, [])

  useEffect(() => {
    const handleCronjob = async () => {
      const cronObj: ExecutedCronjob = executed_cronjob ? JSON.parse(executed_cronjob) : ''
      const checkCron: string = global?.window?.localStorage.getItem('cronJob') ?? ''
      // console.log('cronObj >>>>', executed_cronjob)
      // console.log('checkCron >>>', checkCron, typeof checkCron)
      // console.log('identical >>>', checkCron != executed_cronjob)

      if (cronObj && checkCron != executed_cronjob) {
        try {
          const { data } = await getTasks(deviceId, cronObj.id)
          await updateTaskStatus(cronObj.id, userId, 'success')
          // console.log('cronjob Hẻeeeee')
          // console.log('data', data)
          data && setSwitchState((data[0].trigger_type == 'true') ? true : false)
          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-white">Task Done Successfully: pumpStatus ---- ${data[0].trigger_type === 'true' ? 'ON' : 'OFF'}</p>
              </pre>
            ),
          })
          global?.window?.localStorage.setItem('cronJob', executed_cronjob ?? '')
        } catch (error) {
          console.log('error', error)
        }
      }
    }

    handleCronjob()
  }, [executed_cronjob])

  useEffect(() => {



    const sendData = async () => {
      const token = JSON.parse(JSON.stringify(localStorage.getItem('token')))
      await sendDataTb('pump_relay', 'control', token, deviceId, (switchState ? 1 : 0))
    }

    // console.log('current switch state', switchState)
    // console.log('old switch state', prevSwitchState.current)

    if (prevSwitchState.current !== undefined && switchState !== undefined && prevSwitchState.current !== switchState) {
      // console.log('call here')
      sendData()
    }
  }, [switchState])

  return (
    <div className="flex h-full">
      {/* <div className="flex justify-between mx-4 items-center">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            disabled={{ before: new Date() }}
            onSelect={handlePickDate}
            className="rounded-md border"
          />
          <TaskModal isOpen={isOpen} isSetOpen={isSetOpen} date={date} setDate={setDate} />
          <AlertSensor></AlertSensor>
        </div>
        <div className="flex items-end">
          <div>
            <Switch id="airplane-mode" defaultValue={0} checked={switchState} onCheckedChange={handleSwitch} />
            <Label htmlFor="airplane-mode">
              Pump State: {switchState ? 'On' : 'Off'} Mode
            </Label>
            <LineChartData chartData={ORP} title='demo' />
          </div>
        </div>
      </div > */}
      <div className="w-full h-full overflow-y-auto">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            Autoplay,
            Parallax
          ]}
          direction='vertical'
          spaceBetween={10}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          className="h-[80vh] w-[50%]"

        // autoplay
        // breakpoints={{
        //   200: {
        //     slidesPerView: 1,
        //     spaceBetween: 10
        //   },
        //   640: {
        //     slidesPerView: 2,
        //     spaceBetween: 20
        //   },
        //   768: {
        //     slidesPerView: 3,
        //     spaceBetween: 30
        //   },
        //   1024: {
        //     slidesPerView: 4,
        //     spaceBetween: 10
        //   }
        // }}
        >
          <SwiperSlide>
            <Card
              title="temp"
              icon={<Icons.temperature />}
              value={Number((temp.at(temp.length - 1)?.value ?? 0)).toFixed(2)}
              unit={'oC'}
              texts={['', 'Temperature', '']}
              chartData={temp}
              predictData={predictedTemp}
              deviceId={deviceId}
              threshold={tempThreshHold}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="humid"
              icon={<Icons.droplet />}
              value={Number((humid.at(humid.length - 1)?.value ?? 0)).toFixed(2)}
              unit={'%'}
              texts={['', 'Air Humidity', '']}
              chartData={humid}
              predictData={predictedHumid}
              deviceId={deviceId}
              threshold={humidThreshHold}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="soil"
              icon={<Icons.moon />}
              value={Number((soil.at(soil.length - 1)?.value ?? 0)).toFixed(2)}
              unit={'%'}
              texts={['', 'Soil Humidity', '']}
              chartData={soil}
              predictData={predictedSoil}
              deviceId={deviceId}
              threshold={soilThreshHold}
            />
          </SwiperSlide>
          {/* <SwiperSlide>
            <Card
              title="EC"
              icon={<Icons.temperature />}
              value={Number((EC.at(EC.length - 1)?.value ?? 0)).toFixed(2)}
              unit={'μS/cm'}
              texts={['', 'Seawater Electrical Conductivity', '']}
              chartData={EC}
              predictData={predictedEC}
              deviceId={deviceId}
              threshold={ecThreshHold}
            />
          </SwiperSlide> */}
        </Swiper>
      </div>
    </div >
  )
}
