import { useNavigate } from "react-router-dom"
import { setToken } from "../../reducers/token.reducer"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { FormattedMessage } from "react-intl"
import { useState } from "react"
import { Modal } from "components/model/Model"
import { Button } from "components/button/Button"

const Logout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [showModel, setShowModel] = useState<boolean>(false)
    const handleLogout = () => {
        navigate("/login")
        dispatch(setToken(""))
        localStorage.removeItem("S&S_authtoken")
    }
    return (
        <>
            <li className='w-full md:w-auto xl:w-full ml-1'>
                <span
                    onClick={() => setShowModel(true)}
                    className='hover:cursor-pointer group/hs px-20px py-2.5 md:py-4 space-x-3  flex items-center rounded-xl rtl:space-x-reverse hover:bg-primarycolor text-sm md:text-base font-normal text-secodarycolor hover:text-white hover:font-semibold transition-all ease-in-out duration-200'
                >
                    <i className='icon-logout text-24px text-primarycolor group-hover/hs:text-white w-6'></i>
                    <span>{<FormattedMessage id='Logout' />}</span>
                </span>
            </li>
            {showModel && (
                <>
                    <Modal
                        title={<FormattedMessage id='Logout' />}
                        setShowModal={setShowModel}
                        showModal={showModel}
                        width='w-96'
                    >
                        <div className='flex flex-col items-center justify-center  p-5'>
                            <span className='bg-primarycolor/30 w-14 h-14 flex items-center justify-center p-2 rounded-full'>
                                <i className='icon-logout text-24px text-primarycolor group-hover/hs:text-white '></i>
                            </span>
                            <p className='mt-3 break-words text-darkgrey font-normal text-base'>
                                {<FormattedMessage id='Are_you_sure' />}
                            </p>
                            <p className='text-darkgrey font-normal text-base'>
                                {<FormattedMessage id='you_want_to_logout' />}?
                            </p>
                        </div>
                        <div className='flex flex-row gap-3 mt-3 justify-center'>
                            <Button
                                text={<FormattedMessage id='Cancel' />}
                                type='button'
                                onClick={() => setShowModel(false)}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-secondaryOrange border-2 border-secondaryOrange text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-secondaryOrange focus:ring-0 focus:outline-0'
                            ></Button>
                            <Button
                                text={<FormattedMessage id='Logout' />}
                                type='button'
                                onClick={() => handleLogout()}
                                className='w-48 px-5 py-3 text-sm font-bold text-center text-primarycolor border-2 border-primarycolor text-secondaryorange bg-white rounded-xl hover:text-white hover:bg-primarycolor focus:ring-0 focus:outline-0'
                            ></Button>
                        </div>
                    </Modal>
                </>
            )}
        </>
    )
}

export default Logout
