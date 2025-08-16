"use client"

import { Clock } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Toolbar() {
  const pathname = usePathname()
  const [currenDate, setCurrenDate] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrenDate(new Date())
      }, 1000)
      return () => clearInterval(timer)
    }, [])

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <h2 className="text-2xl font-bold uppercase">{pathname.slice(1)}</h2>
      </div>
      <div className="flex items-center">
<span><Clock size={16} className="mr-2"/></span>
      <p>{currenDate.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}</p>
      </div>
    </div>
  )
}