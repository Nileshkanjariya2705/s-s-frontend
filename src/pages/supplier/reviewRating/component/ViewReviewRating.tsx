import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import Loading from "components/globalLoader/Loading"
import PageNotFound from "components/pageNotFound/PageNotFound"
import { getSingleReviewRating } from "../services/reviewRating.services"
import { singleReviewType } from "../types/reviewRating.type"
import useLocale from "hooks/useLocale"


const ViewReviewRating = () => {
    const navigate = useNavigate()
    const { language } = useLocale();
    const { ratingId } = useParams()
    const [singleRatingData, showSingleRatingData] =
        useState<singleReviewType>()
    const [loading, setLoading] = useState<boolean>(true)
    const [rating, setRating] = useState<number[]>()
    const getReviewRatingDetails = async () => {
        try {
            setLoading(true)
            const response = await getSingleReviewRating(ratingId)
            showSingleRatingData(response?.data?.data)

            const items = []
            for (let i = 0; i < response?.data?.data[0]?.rating; i++) {
                items.push(i + 1)
            }
            setRating(items)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return error
        }
    }
    useEffect(() => {
        getReviewRatingDetails()
    }, [])

    return (
        <>
            {loading ? (
        <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
                <>
                    {singleRatingData ? (
                        <div className='w-full'>
                            <div className='flex mt-8 gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-primarycolor/10 flex items-center justify-center'>
                                    <i
                                        className='icon-left_arrow text-24px text-primarycolor cursor-pointer'
                                        onClick={() => navigate("/ratings")}
                                    ></i>
                                </div>
                                <h2 className='text-xl md:text-2xl font-semibold text-black pr-90 mt-1'>
                                    {
                                        <FormattedMessage id='Review_Rating_Details' />
                                    }
                                </h2>
                            </div>

                            <div>
                                <div className='border border-black/10 rounded-xl p-5 mt-8'>
                                    <h2 className='text-darkgrey text-base font-semibold'>
                                        #{singleRatingData[0].uuid}
                                    </h2>
                                    <div className='flex flex-wrap mt-4 mb-3 -mx-4'>
                                        <div className='relative w-1/2  px-4  border-black/10'>
                                            <div className='flex'>
                                                <div className='w-1/3'>
                                                    <p className='text-sm leading-7 flex items-center justify-between'>
                                                        {
                                                            <FormattedMessage id='StoreName' />
                                                        }{" "}
                                                        <span>:</span>
                                                    </p>
                                                </div>

                                                <div className='w-4/6 px-5'>
                                                    <p className='text-sm leading-7 text-gray-500'>
                                                        {
                                                            singleRatingData[0]
                                                                ?.store_info
                                                                ?.company_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='w-1/3'>
                                                    <p className='text-sm leading-7 flex items-center justify-between'>
                                                        {
                                                            <FormattedMessage id='Product_Name' />
                                                        }{" "}
                                                        <span>:</span>
                                                    </p>
                                                </div>
                                                <div className='w-4/6 px-5'>
                                                    <p className='leading-7  text-gray-500 text-sm '>
                                                        {
                                                            singleRatingData[0]
                                                                ?.product_info[
                                                                `name_${language}`
                                                            ]
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='w-1/3'>
                                                    <p className='text-sm leading-7 flex items-center justify-between'>
                                                        {
                                                            <FormattedMessage id='Ratings' />
                                                        }
                                                        <span>:</span>
                                                    </p>
                                                </div>
                                                <div className='w-4/6 px-5'>
                                                    <p className='text-sm leading-7  text-gray-500'>
                                                        {[1, 2, 3, 4, 5].map(
                                                            (
                                                                _ele: any,
                                                                index: number
                                                            ) => {
                                                                return rating?.includes(
                                                                    index + 1
                                                                ) ? (
                                                                    <i className='icon-star-fill text-PrimaryYellow text-base'></i>
                                                                ) : (
                                                                    <i className='icon-star-outline text-base text-PrimaryYellow'></i>
                                                                )
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='w-1/3'>
                                                    <p className='text-sm leading-7 flex items-center justify-between'>
                                                        {
                                                            <FormattedMessage id='Reviews' />
                                                        }{" "}
                                                        <span>:</span>
                                                    </p>
                                                </div>

                                                <div className='w-4/6 px-5'>
                                                    <p className='leading-7  text-gray-500 text-sm '>
                                                        {
                                                            singleRatingData[0]
                                                                ?.reviews
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PageNotFound />
                    )}
                </>
            )}
        </>
    )
}

export default ViewReviewRating
