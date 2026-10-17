import { Modal } from "components/model/Model"

interface AccountActivationModelStats {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountActivation: React.FC<AccountActivationModelStats> = ({
    showModal,
    setShowModal,
}) => {
    return (
        <Modal
            showModal={showModal}
            title='Add Address'
            setShowModal={setShowModal}
        >
            <div className='data'>hello</div>
        </Modal>
    )
}

export default AccountActivation
