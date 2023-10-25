import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { SearchItemPropsTypes } from "../../../../types";
import styles from "./search_item.module.scss";

function SearchItem({ type, menuL, menuIL, changeMenuItems }: SearchItemPropsTypes) {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const timeoutId: NodeJS.Timeout = setTimeout(() => {
            if (type === "menuItems") {
                const filteredMenuL = menuL?.filter((item) => item.text.toLowerCase().includes(searchValue.toLowerCase()));
                changeMenuItems({ type, menuL: filteredMenuL });
            } else if (type === "menuItemsList") {
                const filteredMenuIL = menuIL?.filter((item) => item.name?.toLowerCase().includes(searchValue.toLowerCase()));
                changeMenuItems({ type, menuIL: filteredMenuIL });
            }
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchValue]);

    return (
        <div className={styles.search_item_wrapper}>
            <div
                className={styles.search_item_wrapper}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <input type="text" placeholder="Search item" autoFocus value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <span>
                    <SearchIcon />
                </span>
            </div>
        </div>
    );
}

export default SearchItem;
