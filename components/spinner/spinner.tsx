import React from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

const Spinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
    </div>
  )
}

export default Spinner
