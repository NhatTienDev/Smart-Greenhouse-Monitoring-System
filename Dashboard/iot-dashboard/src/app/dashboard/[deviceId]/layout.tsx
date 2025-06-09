import { TelemetryProvider } from '@/components/context/TelemetryProvider'
import { ReactNode } from 'react'

export default async function DashboardLayout({
    children,
    params,
}: {
    children: ReactNode
    params: { deviceId: string }
}) {
    return (
        <TelemetryProvider deviceId={params.deviceId}
        // dataPH={dataPH}
        // dataTUR={dataTUR}
        // dataORP={dataORP}
        // dataEC={dataEC}
        >
            {children}
        </TelemetryProvider>
    )
}