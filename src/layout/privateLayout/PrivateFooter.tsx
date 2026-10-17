import FooterLogo from "../../assets/images/footer-logo.svg"
import Call from "../../assets/images/call.svg"
import Message from "../../assets/images/message.svg"
import Facebook from "../../assets/images/facebook.svg"
import Instagram from "../../assets/images/instagram.svg"
import Linkdin from "../../assets/images/linkdin.svg"
import Twitter from "../../assets/images/twitter.svg"
import { FormattedMessage } from "react-intl"
import useUserData from "hooks/getUserData"
const PrivateFooter = () => {
    const { entity_type } = useUserData()

    return (
        <footer className='bg-black px-5 lg:px-12'>
            <div className='mx-auto w-full container '>
                <div className='flex pt-12 py-7 md:py-16  flex-wrap '>
                    <div className='w-full md:w-1/2 lg:w-1/4 xl:w-2/5 px-2 lg:px-0 lg:pr-2 mb-5 xl:mb-0'>
                        <a href='#'>
                            <img src={FooterLogo} alt='FooterLogo' />
                        </a>
                        <div className='max-w-280px'>
                            <p className='text-sm text-white/60 mt-5'>
                                Praesentium ipsam modi nostrum, quibusdam
                                voluptas minus qui quas dicta consequuntur
                                placeat animi cumque
                            </p>
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 lg:w-1/5 xl:w-1/5 px-2 mb-5 xl:mb-0'>
                        <h2 className='mb-3 sm:mb-5 text-lg font-semibold text-white'>
                            {<FormattedMessage id='Useful_links' />}
                        </h2>
                        <ul className='text-base text-white/60 space-y-2 sm:space-y-3 font-normal'>
                            <li>
                                <a href='/'>{<FormattedMessage id='Home' />}</a>
                            </li>
                            <li>
                                {entity_type === "STORE" ? (
                                    <a href='/product/listing'>
                                        {<FormattedMessage id='Products' />}
                                    </a>
                                ) : (
                                    <a href='/products'>
                                        {<FormattedMessage id='Products' />}
                                    </a>
                                )}
                            </li>
                            <li>
                                <a href='/about-us'>
                                    {<FormattedMessage id='About_Us' />}
                                </a>
                            </li>
                            <li>
                                <a href='/purchase-request'>
                                    {<FormattedMessage id='Purchase_Request' />}
                                </a>
                            </li>
                            <li>
                                <a href='/blog'>
                                    {<FormattedMessage id='Blog' />}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className='w-full md:w-1/2 lg:w-1/5 xl:w-1/5 px-2 mb-5 xl:mb-0'>
                        <h2 className='mb-3 sm:mb-5 text-lg font-semibold text-white'>
                            {<FormattedMessage id='Help' />}
                        </h2>
                        <ul className='text-base text-white/60 space-y-2 sm:space-y-3 font-normal'>
                            <li>
                                <a href='/manage-profile'>
                                    {<FormattedMessage id='My_Account' />}
                                </a>
                            </li>
                            <li>
                                <a href='/contact-us'>
                                    {<FormattedMessage id='Contact_Us' />}
                                </a>
                            </li>
                            <li>
                                <a href='/support-ticket'>
                                    {<FormattedMessage id='Ticket' />}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className='w-full md:w-1/2 lg:w-1/3 xl:w-1/5 px-2 mb-5 xl:mb-0'>
                        <h2 className='mb-3 sm:mb-5 text-lg font-semibold text-white'>
                            {<FormattedMessage id='Contact_Us' />}
                        </h2>
                        <ul className='text-base text-white/60 space-y-5 sm:space-y-7 font-normal'>
                            <li className='flex items-start gap-3'>
                                <img src={Call} alt='call' className='mt-1' />
                                <div className='w-full'>
                                    <p className='text-base text-white/60 font-normal'>
                                        {<FormattedMessage id='Phone' />}
                                    </p>
                                    <a
                                        href='tel:+1123 456 7890'
                                        className='text-white font-semibold mt-1 inline-block'
                                    >
                                        (+1) 123 456 7890
                                    </a>
                                </div>
                            </li>
                            <li className='flex items-start gap-3'>
                                <img
                                    src={Message}
                                    alt='call'
                                    className='mt-1'
                                />
                                <div className='w-full'>
                                    <p className='text-base text-white/60 font-normal'>
                                        {
                                            <FormattedMessage id='Email_address' />
                                        }
                                    </p>
                                    <a
                                        href='mailto:companyname@gmail.com'
                                        className='text-white font-semibold mt-1 inline-block'
                                    >
                                        companyname@gmail.com
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className='border-white/30' />
                <div className='flex items-center flex-wrap px-2 py-5 sm:py-7'>
                    <div className='w-full flex-wrap sm:w-2/3 lg:w-2/4 flex justify-center sm:justify-start gap-x-0  sm:gap-x-4 md:gap-x-7'>
                        <p className='text-base text-white/60'>
                            @2024 {<FormattedMessage id='S_S' />}
                        </p>
                        <ul className='flex text-base  text-white mt-3 sm:mt-0'>
                            <li>
                                <a href='#'>
                                    {<FormattedMessage id='Privacy_Policy' />}
                                </a>
                            </li>
                            <li>
                                <span className='px-3.5'>|</span>
                            </li>
                            <li>
                                <a href='#'>
                                    {<FormattedMessage id='Terms_Conditions' />}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className='w-full sm:w-2/6 lg:w-2/4 flex gap-x-4 justify-center sm:justify-end mt-4 sm:mt-0'>
                        <a
                            href='#'
                            className='w-8 h-8 bg-white rounded-3xl flex items-center justify-center'
                        >
                            <img src={Facebook} alt='facebook' />
                        </a>
                        <a
                            href='#'
                            className='w-8 h-8 bg-white rounded-3xl flex items-center justify-center'
                        >
                            <img src={Linkdin} alt='facebook' />
                        </a>
                        <a
                            href='#'
                            className='w-8 h-8 bg-white rounded-3xl flex items-center justify-center'
                        >
                            <img src={Twitter} alt='facebook' />
                        </a>
                        <a
                            href='#'
                            className='w-8 h-8 bg-white rounded-3xl flex items-center justify-center'
                        >
                            <img src={Instagram} alt='facebook' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PrivateFooter
