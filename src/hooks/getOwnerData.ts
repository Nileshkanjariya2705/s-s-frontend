import { useSelector } from "react-redux"
import { RootState } from "store"

const useOwnerData = () => {
    const {
        address,
        company_name,
        cr_number,
        tax_number,
        iban_number,
        is_verified,
        store_uuid,
    } = useSelector((state: RootState) => ({
        address: state.ownership.address,
        company_name: state.ownership.company_name,
        cr_number: state.ownership.cr_number,
        tax_number: state.ownership.tax_number,
        iban_number: state.ownership.iban_number,
        is_verified: state.ownership.is_verified,
        store_uuid: state.ownership.store_uuid,
    }))

    return {
        address,
        company_name,
        cr_number,
        tax_number,
        iban_number,
        is_verified,
        store_uuid,
    }
}

export default useOwnerData
