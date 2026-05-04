import { useEffect, useState } from "react";
import luffy from '../../assets/imgs/luffy_explore.png';
import luffy2 from '../../assets/imgs/luffy_content.png';
import luffy3 from '../../assets/imgs/luffy_pret.png';
import vogmerry from '../../assets/imgs/vogmerry.png';

const etapes = [
    {
        type: "intro",
        image: vogmerry,
        titre: "Bienvenue sur OtakuKamer !",
        texte: "Laisse-nous te guider à travers les fonctionnalités principales.",
    },
    {
        element: "nav",
        image: luffy,
        titre: "La barre de navigation",
        texte: "Recherche un événement, accède aux actualités ou connecte-toi depuis ici.",
    },
    {
        element: "aside",
        image: luffy2,
        titre: "Le menu principal",
        texte: "Accède à tes billets, ton calendrier et tes paramètres depuis la sidebar si tu es simple membre ou à ton dashboard si tu es organisateur.",
    },
    {
        element: "#liste-evenements",
        image: luffy3,
        titre: "Les événements",
        texte: "Filtre et explore tous les événements Otaku disponibles au Cameroun.",
    },
];

function Onboarding({ run, setRun }) {
    const [etape, setEtape] = useState(0);
    const [rect, setRect] = useState(null);
    

    // Calcule la position de l'élément ciblé
    useEffect(() => {
        if (!run) { setEtape(0); return; }

        const step = etapes[etape];
        if (step.type === "intro") { setRect(null); return; }

        const el = document.querySelector(step.element);
        if (!el) { setRect(null); return; }

        el.scrollIntoView({ behavior: "smooth", block: "center" });

        // Petit délai pour laisser le scroll se terminer
        setTimeout(() => {
            setRect(el.getBoundingClientRect());
        }, 300);
    }, [etape, run]);

    if (!run) return null;

    const step = etapes[etape];
    const isIntro = step.type === "intro";

    // Position du tooltip — version responsive
    const tooltipStyle = (() => {
        if (isIntro) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
        if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

        const tooltipW = 280;
        const tooltipH = 320; // hauteur estimée du tooltip
        const padding = 12;
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Sur mobile — tooltip toujours centré en bas de l'écran
            return {
                bottom: padding,
                left: "50%",
                transform: "translateX(-50%)",
            };
        }

        // Desktop — sous l'élément ciblé
        let top = rect.bottom + 16;
        let left = rect.left + rect.width / 2 - tooltipW / 2;

        // Débordement bas → place au dessus
        if (top + tooltipH > window.innerHeight - padding) {
            top = rect.top - tooltipH - 16;
        }
        // Débordement haut → centré verticalement
        if (top < padding) {
            top = window.innerHeight / 2 - tooltipH / 2;
        }
        // Débordement droite
        if (left + tooltipW > window.innerWidth - padding) {
            left = window.innerWidth - tooltipW - padding;
        }
        // Débordement gauche
        if (left < padding) {
            left = padding;
        }

        return { top, left };
    })();

    const terminer = () => { setRun(false); setEtape(0); };
    const suivant = () => etape < etapes.length - 1 ? setEtape(e => e + 1) : terminer();
    const precedent = () => etape > 0 && setEtape(e => e - 1);

    return (
        <>
            {/* OVERLAY SOMBRE */}
            <div
                className="fixed inset-0 z-[9998]"
                style={{ background: "rgba(0,0,0,0.65)" }}
                onClick={terminer}
            />

            {/* SPOTLIGHT — découpe un "trou" autour de l'élément ciblé */}
            {!isIntro && rect && (
                <div
                    className="fixed z-[9999] rounded-xl pointer-events-none"
                    style={{
                        top: rect.top - 4,
                        left: rect.left - 4,
                        width: rect.width + 8,
                        height: Math.min(rect.height + 8, window.innerHeight * 0.4), // ← limite la hauteur sur mobile
                        boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
                        border: "2px solid #C2611F",
                    }}
                />
            )}

            {/* TOOLTIP */}
            <div
                className="fixed z-[10000] bg-white rounded-2xl shadow-2xl p-5 flex flex-col items-center gap-3"
                style={{
                    ...tooltipStyle,
                    width: "min(280px, calc(100vw - 24px))",  // ← jamais plus large que l'écran
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* IMAGE — plus petite sur mobile */}
                <img
                    src={step.image}
                    className="h-28 md:h-36 object-contain anime-flotter hover:scale-110 transition-transform duration-300"
                    alt="personnage"
                />

                {/* TITRE */}
                <h3 className="font-bold text-lg text-center text-[#1A1A2E]">
                    {step.titre}
                </h3>

                {/* TEXTE */}
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                    {step.texte}
                </p>

                {/* PROGRESS DOTS */}
                <div className="flex gap-2">
                    {etapes.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === etape ? "w-6 bg-[#C2611F]" : "w-2 bg-gray-300"
                            }`}
                        />
                    ))}
                </div>

                {/* BOUTONS */}
                <div className="w-full flex justify-between items-center">
                    <button
                        className="text-sm text-gray-400 hover:text-gray-600 transition"
                        onClick={terminer}
                    >
                        Quitter
                    </button>

                    <div className="flex gap-2">
                        {etape > 0 && (
                            <button
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"
                                onClick={precedent}
                            >
                                ←
                            </button>
                        )}
                        <button
                            className="px-4 py-2 bg-[#C2611F] text-white rounded-lg text-sm font-bold hover:bg-[#a14f19] transition"
                            onClick={suivant}
                        >
                            {etape === etapes.length - 1 ? "Terminer !" : "Suivant →"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Onboarding;