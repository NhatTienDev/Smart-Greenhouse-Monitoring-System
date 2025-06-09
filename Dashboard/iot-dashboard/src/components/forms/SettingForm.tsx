'use client'
import { startTransition, useTransition } from 'react'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { createSetting, sendDataTb } from '@/actions'
import { useToast } from '@/hooks/use-toast'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const FormSchema = z.object({
  monitoringTime: z.number().gte(10, {
    message: 'You can only set the monitoring time with value greater or equal 10 seconds'
  }),
  entityId: z.string()
})

export const SettingForm = ({ deviceId }: { deviceId: string }) => {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      monitoringTime: 10
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const token = JSON.parse(JSON.stringify(localStorage.getItem('token')))

    const { monitoringTime } = data

    try {
      const res = await sendDataTb('measurement_time', 'control', token, deviceId, monitoringTime)

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-white">Submitted Successfully</p>
          </pre>
        ),
      })
    } catch (error) {
      console.log('error >>>>>', error)
    }
    form.reset()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`
          w-full
          grid 
          grid-cols-1 
          md:grid-cols-[3fr_1fr] 
          gap-4
        `}
      >
        {/* =======================
            Cột trái: hai trường input, xếp dọc với khoảng cách space-y-6
            ======================= */}
        <div className="space-y-6">
          {/* ──────────── Monitoring Time ──────────── */}
          <FormField
            control={form.control}
            name="monitoringTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Time</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="60"
                    className="w-full"
                    {...field}
                    onChange={(e) => {
                      const v = e.target.value
                      // Nếu input rỗng → truyền undefined để form hiểu là chua nhập
                      field.onChange(v === '' ? undefined : Number(v))
                    }}
                  />
                </FormControl>
                <FormDescription>
                  A number representing how long to monitor again (in seconds). For example “60”.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ──────────── EntityId ──────────── */}
          <FormField
            control={form.control}
            name="entityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EntityId</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="784f394c-42b6-435a-983c-b7beff2784f9"
                    className="w-full"
                    {...field}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  A string representing the entity ID. For example “784f394c-42b6-435a-983c-b7beff2784f9”.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =======================
            Cột phải: Nút “Edit” căn dưới
            ======================= */}
        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full flex justify-center gap-2"
          >
            <span>Edit</span>
            {isPending && (
              <Icons.spinner className="animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
