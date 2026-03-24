import { useState, useEffect } from 'react'
import axios from 'axios'
// import localisation from '../../assets/icons/map.svg'
import chevron_droite from '../../assets/icons/droit.svg'
import chevron_gauche from '../../assets/icons/gauche.svg'

function CarrouselEvenements({ image, photos = [] }){

    // UseState qui va se charger de parcourir le carousel
    const [indexActuel, setIndexActuel] = useState(0)

    const allerGauche = () => {
        if (indexActuel === 0) {
            setIndexActuel(photos.length - 1)
        } else {
            setIndexActuel(indexActuel - 1)
        }
    }

    const allerDroite = () => {
        if (indexActuel === photos.length - 1) {
            setIndexActuel (0)
        } else {
            setIndexActuel(indexActuel + 1)
        }
    }
        
    
    return (
        <div>
            <article className='text-[14px] w-full h-full flex flex-col justify-center gap-2 items-center'>
                <div className='w-full flex justify-between items-center'>
                    <div className='w-ful'>
                        <h3>Galerie photos</h3>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                        <button
                            onClick={allerGauche}
                            className='cursor-pointer border-1 border-black rounded-md h-7 w-7 shadow shadow-black-500/40 flex justify-center items-center'><img className='h-5 w-5' src={chevron_droite} alt="Icon de la localisation" /></button>
                        <button
                            onClick={allerDroite}
                            className='cursor-pointer border-1 border-black rounded-md h-7 w-7 shadow shadow-black-500/40 flex justify-center items-center'><img className='h-5 w-5' src={chevron_gauche} alt="Icon de la localisation" /></button>
                    </div>
                </div>
                <div className='relative h-90 w-full rounded-xl bg-cover bg-center bg-gray-200'
                    style={{ backgroundImage: `url(${photos.length > 0 ? photos[indexActuel]?.image : image})` }}>
                    <div className='w-full flex justify-end p-2'>
                        <div className='absolute h-8 w-8 bg-white/70 rounded-full flex justify-center items-center'>
                            <span>{indexActuel + 1}/{photos.length}</span>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}


export default CarrouselEvenements