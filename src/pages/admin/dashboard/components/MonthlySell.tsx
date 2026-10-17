import { useEffect, useState } from "react"
import { monthlySelling } from "../services/dashboard.services"
import ReactApexChart from "react-apexcharts"
import { FormattedMessage } from "react-intl"
import { Button } from "components/button/Button"
import useLocale from "hooks/useLocale"

const MonthlySell = () => {
    const [monthWiseData, setMonthWiseData] = useState<string[]>([])
    const [monthlySellTotalAmount, setMonthlySellTotalAmount] = useState<
        number[]
    >([])
    const currentYear = new Date().getFullYear()
    const [dateValues, setDateValues] = useState<{
        fromDate: string
        toDate: string
    }>({
        fromDate: `${currentYear}-01-01`,
        toDate: `${currentYear}-12-31`,
    })
     const { language } = useLocale();

    let isRtl = language === "en" ? false : true
    const series = [
        {
            name: "amount",
            data: monthlySellTotalAmount,
        },
    ]
    if (isRtl) {
        series.map((s) => s["data"].reverse())
    }

    const options: {} = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },

        title: {
            text: "Product sales by Month",
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: monthWiseData,
        },
        yaxis: {
            opposite: isRtl,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 560,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        stroke: {
            curve: "smooth",
        },
    }

    const fetchData = async () => {
        setMonthlySellTotalAmount([])
        const response = await monthlySelling(
            dateValues.fromDate,
            dateValues.toDate,
            language
        )
        let monthData = response?.data.data.map((item: any) => item.month)
        if (language !== "en") {
            monthData = monthData.reverse()
        }
        setMonthWiseData(monthData)
        setMonthlySellTotalAmount(
            response?.data.data.map((item: any) => item.total_amount.toFixed(2))
        )
    }
    
    useEffect(() => {
        fetchData()
    }, [language])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setDateValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }
    const handleSubmit = async () => {
        fetchData()
    }

    return (
        <>
            <div className='flex items-center flex-wrap gap-5'>
                <div className='relative w-full md:w-unset md:max-w-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <svg
                            className='w-4 h-4 text-gray-500 '
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path d='M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z' />
                        </svg>
                    </div>
                    <input
                        datepicker-orientation='bottom right'
                        type='date'
                        name='fromDate'
                        value={dateValues.fromDate}
                        onChange={(e) => handleChange(e)}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5'
                        placeholder='Select date'
                    />
                </div>
                <div className='relative w-full md:w-unset md:max-w-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <svg
                            className='w-4 h-4 text-gray-500 '
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path d='M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z' />
                        </svg>
                    </div>
                    <input
                        datepicker-orientation='bottom right'
                        type='date'
                        name='toDate'
                        value={dateValues.toDate}
                        onChange={(e) => handleChange(e)}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5'
                        placeholder='Select date'
                    />
                </div>

                <Button
                    text={<FormattedMessage id='Submit' />}
                    type='button'
                    onClick={handleSubmit}
                    className='bg-Primarycolors rounded-xl text-center text-white px-5 py-2.5 w-auto'
                ></Button>
            </div>
            <div id='chart'>
                <div className='border border-black/10 rounded-xl mt-10 p-4 overflow-x-auto w-full language-ch-arb'>
                    <ReactApexChart
                        options={options}
                        series={series}
                        type='line'
                        height={"528px"}
                        width={"100%"}
                    />
                </div>
            </div>
        </>
    )
}
export default MonthlySell
