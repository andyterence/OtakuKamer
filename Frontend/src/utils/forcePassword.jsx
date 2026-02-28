export function forcePassword(password) {

    const passwordColor = (password) => {
        if (password.length === 0) {
            return "bg-gray-300";
        }
        if (password.length < 8) {
            return "bg-red-500";
        } else if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return "bg-yellow-500";
        } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) || !/[1-9]/.test(password) && /[@$!%*?&]/.test(password)){
            return "bg-green-500";
        }
    }

    const progressWidth = password.length < 8 ? "w-[25%]" : password.length < 12 ? "w-[50%]" : "w-[100%]";

    return(
        <div>
            <div className="progress w-full bg-gray-200 rounded-full h-2">
                <div className={`progress-bar ${progressWidth} h-full ${passwordColor(password)}`}></div>
                <p className="text-xs text-center mt-1">{getNiveauPassword(password)}</p>
            </div>
        </div>
    )
}
export default forcePassword

export function getNiveauPassword(password) {
        if (password.length === 0) {
            return "Très faible";
        }
        if (password.length < 8) {
            return "Faible";
        } else if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return "Moyen";
        } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)){
            return "Fort";
        } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) || !/[1-9]/.test(password) && /[@$!%*?&]/.test(password)){
            return "Très fort";
        }
    }
    