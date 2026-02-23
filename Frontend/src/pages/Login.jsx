import { useState } from 'react'
import logo from '../assets/logos/OtakuKamer_logo.png'
import goku from '../assets/imgs/goku_bienvenue.png'

function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')

const handleSubmit = () => {
    console.log(email, motDePasse)
}

  return (
    <div className='bg-[#0D0D0D] min-h-screen flex items-center justify-center'>
        <section className='w-1/2 h-screen flex flex-col items-center justify-center gap-2'>
            <div className='flex items-center justify-center text-[#F1F1F1] gap-2 p-4'>
                <img className='h-10 h-10' src={logo} alt="Logo d'OtakuKamer" />
                <h1 className='md:text-2xl font-bold'>OtakuKamer</h1>
            </div>
            <div className='flex items-center justify-center'>
                <img className='w-60 h-auto' src={goku} alt="Image de bienvenue" />
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='w-70'>
                    <h2 className='text-2xl text-center text-[#F1F1F1] mb-4'>Vivez votre passion Otaku au Cameroun</h2>
                </div>
                <div className='w-100'>
                    <p className='text-center text-[#9CA3AF]'>Vivez l’expérience Otaku à 100 % : suivez les news de la communauté et réservez vos places pour les plus grands festivals du pays.</p>
                </div>
            </div>
        </section>
        <section className='w-1/2 bg-[#1A1A2E] h-screen'></section>
    </div>
  )
}

export default Login