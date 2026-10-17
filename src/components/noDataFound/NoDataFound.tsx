import NoDataImage from "../../assets/images/no-data.png"
interface PropsState {
    text: React.ReactNode
}
export const NoData = ({ text }: PropsState) => {
    return (
        <div className='flex flex-col items-center justify-center  py-2 bg-white '>
            <img src={NoDataImage} alt='' className='w-72' />
            <h3 className='text-black text-base font-semibold mt-3 text-center'>
                {text}
            </h3>
        </div>
    )
}
