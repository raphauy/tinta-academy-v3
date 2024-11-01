import { Check, Loader } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CouponDAO } from "@/services/coupon-services"

type Props= {
  priceUSD?: number
  coupon: CouponDAO | null
  onApplyCoupon: (code: string) => Promise<void>
}

export default function DiscountCoupon({ priceUSD = 99.99, coupon, onApplyCoupon}: Props) {
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)

  const finalPrice = coupon ? priceUSD - (priceUSD * coupon.discount) / 100 : priceUSD

  useEffect(() => {
    if (coupon) {
      setCouponCode(coupon.code)
    }
    setLoading(false)
  }, [coupon])

  async function handleApplyCoupon() {
    setLoading(true)
    await onApplyCoupon(couponCode.trim().toUpperCase())
    setLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="text-lg font-semibold">{priceUSD} USD</span>
            </div>
            {coupon && (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Descuento:</span>
                  <Badge variant="secondary" className="font-semibold">
                    {coupon.discount}% OFF
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between border-t pt-4">
                  <span className="text-base font-medium">Precio final:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{finalPrice} USD</span>
                    <div className="text-xs text-muted-foreground">
                      Ahorro: {(priceUSD - finalPrice)} USD
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="space-y-4 lg:border-l lg:pl-6">
            <div className="space-y-2">
              <label htmlFor="coupon" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cupón de descuento
              </label>
              <div className="flex space-x-2">
                <Input
                  id="coupon"
                  placeholder="Ingresa aquí"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="uppercase"
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || loading}
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  Aplicar
                </Button>
              </div>
            </div>
            {coupon && (
              <div className="flex items-center justify-center pt-4 w-full gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>Cupón {coupon.code}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}