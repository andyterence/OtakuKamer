import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import background from '../assets/imgs/background.jpg'
import move_left from '../assets/icons/move-left.svg'
import star from '../assets/icons/star.svg'
import users from '../assets/icons/users.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
// import notif from '../../assets/icons/bell.svg'

export default function CreateEven() {

    const { id } = useParams()
    const [evenement, setEvenement] = useState(null)
    const [enAttente, setEnAttente] = useState(false)
    // Pour pouvoir naviguer entre les paged
    // const navigate = useNavigate()

    useEffect(() => {
        const chargerEvenement = async() => {
            setEnAttente(true)
            try {
                const reponse = await axios.get(`http://localhost:8000/api/evenements/${id}/`)
                setEvenement(reponse.data)
            } catch (_err) {
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerEvenement()
    }, [id])

    return (
        <div>
        </div>
    )
}