import { useEffect, useRef } from "react"
import Sheet from "../comps/sheet"

const useToast = () => {

    const sheet = useRef(null);

    useEffect(() => {
        
    }, [])

    return <Sheet ref={sheet} />


}

export default useToast