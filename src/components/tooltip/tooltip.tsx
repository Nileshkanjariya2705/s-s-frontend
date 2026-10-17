import { FC, ReactNode } from "react"

interface Props {
    children: ReactNode
    tooltip?: string
    showTooltip?: boolean
}

const Tooltip: FC<Props> = ({ children, tooltip }): JSX.Element => {
    return (
        <div className='group relative text-end inline-block'>
            {children}
            <span className='p-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute top-8 right-0 rtl:left-0 rtl:right-unset min-w-140px text-sm text-center px-3 py-2 bg-primaryGreens  text-primarycolor top border border-Primarycolors/10 rounded-lg z-10 '>
                {tooltip}
            </span>
        </div>
    )
}

export default Tooltip
