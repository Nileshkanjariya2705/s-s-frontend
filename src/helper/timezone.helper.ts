import moment from "moment"

export const utcToLocal = (date: string) => {
    const timeFromUser = moment(date)
    return timeFromUser.format("DD-MM-YYYY")
}

export const remainingTime = (endDate: string, displaySec?: boolean) => {
    const now: Date = new Date()
    const endTime: Date = new Date(endDate)

    const timeDifference: number = endTime.getTime() - now.getTime()

    if (timeDifference < 0) {
        return "End date has passed"
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    )
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

    if (displaySec) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`
    } else {
        return `${days}d ${hours}h ${minutes}m`
    }
}

export const remainingDaysTime = (endDate: string) => {
    if (endDate !== undefined) {
        const now: Date = new Date()
        const endTime: Date = new Date(endDate)
        const timeDifference: number = endTime.getTime() - now.getTime()

        if (timeDifference < 0) {
            return null
        }
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

        return {
            days,
            hours,
            minutes,
            seconds,
        }

        // return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
    }
}
