import { useState } from "react";



export const Loader = (initialLoadingState:boolean=false) => {
const [isLoading , setIsLoading] = useState<boolean>(initialLoadingState)

const startLoading = ()=> setIsLoading(true)
const stopLoading = ()=> setIsLoading(false)

return {isLoading , startLoading , stopLoading}
}


