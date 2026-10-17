import { Notyf } from "notyf"
import "notyf/notyf.min.css"

export const showToast = (
    message: string,
    type: string,
    intl: any,
    duration: number = 3000,
    dismissable: boolean = false
) => {
    const notyf = new Notyf({
        duration: duration,
        position: {
            x: "right",
            y: "top",
        },
    })

    switch (type) {
        case "success":
            notyf.success({
                message: intl.formatMessage({ id: message }),
                dismissible: dismissable,
                background: "rgb(85,117,45)",
            })
            break
        case "error":
            notyf.error({
                message: intl.formatMessage({ id: message }),
                dismissible: dismissable,
            })
            break
        default:
            break
    }
}
