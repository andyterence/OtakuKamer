import { useState } from "react";
import logo from '../assets/logos/OtakuKamer_logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";
import Sidebar from "../components/shared/sidebar";

function Accueil() {

    return(

        <div className="flex items-start">
            <aside className="w-1/5 sticky top-0 h-screen">
                <Sidebar />
            </aside>
            <main className="w-4/5">
                <Hero />
                <ListeEvenements />
                <ListeNews />
            </main>
        </div>
    )
}

export default Accueil