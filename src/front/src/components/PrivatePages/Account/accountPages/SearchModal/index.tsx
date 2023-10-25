import styles from "./search_modal.module.scss";
import HelperSearch from "../../../../helpersComponents/HelperSearch";

const SearchModal = ({ close }: { close: Function }) => {
    const handleModalClickToClose = (e: React.MouseEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLElement)?.id;
        targetId === "close_" && close("isSearchOpen", false);
    };
    return (
        <div className={styles.search_modal_wrapper} id="close_" onClick={(e) => handleModalClickToClose(e)}>
            <HelperSearch
                placeholder="account.search_in_masq"
                style={{
                    width: "410px",
                    height: "60px",
                    fontSize: "16px",
                    borderRadius: "16px",
                    inpPaddingLeft: "51px",
                    iconWidth: 26,
                    iconTop: "18px",
                    iconLeft: "16px",
                }}
            />
        </div>
    );
};

export default SearchModal;
