import { remainingTime } from "helper/timezone.helper"
import { useEffect, useState } from "react"

type CountdownProps = {
    end_date: string
    displaySec?: boolean
}
export const Countdown: React.FC<CountdownProps> = ({
    end_date,
    displaySec,
}) => {
    const [remainingTimeString, setRemainingTimeString] = useState<string>(
        remainingTime(end_date)
    )
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTimeString(remainingTime(end_date, displaySec))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [end_date])
    return <span>{remainingTimeString}</span>
}
