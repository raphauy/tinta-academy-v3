
type Props = {
    searchParams: {
        payment_id: string
        status: string
        status_detail: string
    }
}
export default function MpCallback({ searchParams }: Props) {
    const { payment_id, status, status_detail } = searchParams
    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-4">Callback de MercadoPago</h1>
            <p>payment_id: {payment_id}</p>
            <p>status: {status}</p>
            <p>status_detail: {status_detail}</p>
        </div>
    )
}