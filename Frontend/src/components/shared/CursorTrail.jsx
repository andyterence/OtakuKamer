import { useEffect, useRef } from "react"

export default function CursorTrail() {
    
    const trailRefs = useRef([])    // On utilise un tableau de refs pour pouvoir accéder à chaque point du trail individuellement
    const nbPoints = 12        // nombre de cercles

    useEffect(() => {
        // position de la souris
        let mouseX = 0
        let mouseY = 0
        // positions de chaque point
        const points = Array(nbPoints).fill({ x: 0, y: 0 })
        // on écoute les mouvements de la souris pour mettre à jour sa position
        const move = (e) => {
            mouseX = e.clientX 
            mouseY = e.clientY
        }
        // on anime les points pour qu'ils suivent la souris avec un effet de traînée
        window.addEventListener("mousemove", move)
        // fonction d'animation qui sera appelée à chaque frame
        const animate = () => {
            let x = mouseX
            let y = mouseY
            // pour chaque point du trail, on le déplace vers la position de la souris avec un décalage progressif
            trailRefs.current.forEach((el, index) => {
                if (!el) return

                // interpolation douce
                points[index] = {
                    x: x,
                    y: y
                }
                // on applique une transformation CSS pour positionner le point et lui donner une taille décroissante
                el.style.transform = `translate(${x}px, ${y}px) scale(${(nbPoints - index) / nbPoints})`

                // le prochain point suit celui-ci avec retard
                const next = points[index + 1] || points[index]
                // on fait avancer le point vers la position de la souris avec un facteur de lissage
                x += (next.x - x) * 0.3
                y += (next.y - y) * 0.3
            })
            // on demande la prochaine frame d'animation
            requestAnimationFrame(animate)
        }

        animate()
        // on nettoie l'écouteur d'événements quand le composant est démonté
        return () => window.removeEventListener("mousemove", move)
    }, [])

    return (
        <>
            {/* Trail de points derrière la souris */}
            {Array.from({ length: nbPoints }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    className="pointer-events-none fixed top-0 left-0 z-[9999]"
                >
                    <div className="w-3 h-3 bg-[#C2611F] rounded-full opacity-70"></div>
                </div>
            ))}
        </>
    )
}