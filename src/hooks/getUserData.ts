import { useSelector } from "react-redux";
import { RootState } from "store";
type EntityType = "STORE" | "SUPPLIER" ;


const useUserData = () => {
  const {
    token,
    role,
    role_ar,
    role_ur,
    email,
    uuid,
    phone,
    image,
    username,
    user_entity_uuid,
    entity_type,
    all_permissions,
    given_permissions,
    is_active,
  } = useSelector((state: RootState) => ({
    token: state.token.token,
    email: state.account.email,
    role: state.account.role,
    role_ar: state.account.role_ar,
    role_ur: state.account.role_ur,
    uuid: state.account.uuid,
    phone: state.account.phone,
    image: state.account.image,
    username: state.account.username,
    user_entity_uuid: state.account.user_entity_uuid,
    entity_type: state.account.entity_type as EntityType,
    all_permissions: state.account.all_permissions,
    given_permissions: state.account.given_permissions,
    is_active: state.account.is_active,
  }));

  return {
    token,
    role,
    role_ar,
    role_ur,
    email,
    is_active,
    uuid,
    phone,
    image,
    username,
    user_entity_uuid,
    entity_type,
    all_permissions,
    given_permissions,
  };
};

export default useUserData;
