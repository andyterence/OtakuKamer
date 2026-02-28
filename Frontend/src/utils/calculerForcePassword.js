export function calculerForcePassword(motDePasse) {
    let force = 0;
    if (motDePasse.length >= 8) force += 1;
    if (/[A-Z]/.test(motDePasse)) force += 1;
    if (/[a-z]/.test(motDePasse)) force += 1;
    if (/\d/.test(motDePasse)) force += 1;
    if (/[@$!%*?&]/.test(motDePasse)) force += 1;

    if (force == 0) {
    return "Très faible"; 
    } else if (force== 1) {
        return "Faible";
    } else if (force == 2) {
        return "Moyen";
    } else if (force == 3) {
        return "Fort";
    } else if (force == 4) {
        return "Très fort";
    }
    return force;
}