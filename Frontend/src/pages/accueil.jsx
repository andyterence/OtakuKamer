import { useState } from "react";
import logo from '../assets/logos/OtakuKamer_logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";

function Accueil() {

    return(

        <div>
            <nav></nav>
            <Hero />
            <ListeEvenements />
            <ListeNews />
        </div>
    )
}

export default Accueil