import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Verify() {
  const [params] = useSearchParams()
  const { token, backendUrl, setCartItems, navigate } = useShop()

  useEffect(() => {
    const verify = async () => {
      const success  = params.get('success')
      const orderId  = params.get('orderId')
      if (!success || !orderId) { navigate('/'); return }

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/order/verifystripe`,
          { success, orderId },
          { headers: { token } }
        )
        if (data.success) {
          setCartItems({})
          toast.success('Payment confirmed! Your order is placed.')
          navigate('/orders')
        } else {
          toast.error('Payment failed. Please try again.')
          navigate('/cart')
        }
      } catch (err) {
        toast.error(err.message)
        navigate('/cart')
      }
    }
    verify()
  }, [params, token])

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20 }}>
      <div style={{
        width:48, height:48,
        border:'3px solid var(--mist)',
        borderTopColor:'var(--gold)',
        borderRadius:'50%',
        animation:'spin .8s linear infinite'
      }} />
      <p style={{ fontFamily:'var(--display)', fontSize:22, color:'var(--ink)' }}>Verifying payment…</p>
      <p style={{ fontSize:14, color:'var(--mid)' }}>Please don't close this window.</p>
    </div>
  )
}