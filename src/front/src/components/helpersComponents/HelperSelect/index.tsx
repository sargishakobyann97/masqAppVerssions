import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { HelperSelectPropsTypes, SelectsMenuItemsTypes, HardwareAllTypes } from "../../../types";
import styles from "./helper_select.module.scss";
import { constants } from "../../../assets/constants";
import SearchItem from "./SearchItem";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setIsChooseParameterRedux } from "../../../store/features/profilesSlice";

const { create_new_team } = constants;

const HelperSelect = ({
    selectValue = "",
    selectItem = {},
    menuItems = [],
    menuItemsList = [],
    onChange = () => {},
    type = "",
    customStyles = {},
    disabled = false,
    chooseParameterType = "",
}: HelperSelectPropsTypes) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isChooseParameter } = useAppSelector((state) => state.profiles);
    const [menuItemsLocal, setMenuItemsLocal] = useState<SelectsMenuItemsTypes[]>([]);
    const [menuItemsListLocal, setMenuItemsListLocal] = useState<HardwareAllTypes[]>([]);

    const changeMenuItems = ({
        type,
        menuL,
        menuIL,
    }: {
        type: "menuItemsList" | "menuItems";
        menuL?: SelectsMenuItemsTypes[];
        menuIL?: HardwareAllTypes[];
    }) => {
        if (type === "menuItems" && menuL) {
            setMenuItemsLocal(menuL);
        } else if (type === "menuItemsList" && menuIL) {
            setMenuItemsListLocal(menuIL);
        }
    };

    const isItem = Object.keys(selectItem).length;
    const value = isItem ? selectItem.name : selectValue;
    const renewTeam = menuItems?.[0]?.id === create_new_team ? t("sundry.renew_team") : "";

    return (
        <div>
            <FormControl>
                <Select
                    value={value}
                    onChange={(e: SelectChangeEvent) => {
                        onChange(type, e.target.value);
                    }}
                    onClick={() => {}}
                    onFocus={() => {
                        dispatch(setIsChooseParameterRedux({ parameter: "" }));
                    }}
                    displayEmpty
                    variant="outlined"
                    inputProps={{ "aria-label": "Without label" }}
                    className={styles.select_place}
                    disabled={disabled}
                    sx={{
                        width: 224,
                        fontFamily: "Inter-400",
                        fontSize: 12,
                        color: "#292929",
                        border: (isChooseParameter === chooseParameterType && isChooseParameter && "2px solid #007aff") + "",
                        ...customStyles,
                    }}
                    style={{ height: customStyles.height || "36px" }}
                >
                    {isItem
                        ? [
                              menuItemsList.length > 10 && (
                                  <SearchItem key="SearchItem-1" type="menuItemsList" menuIL={menuItemsList} changeMenuItems={changeMenuItems} />
                              ),
                              ...(!!menuItemsListLocal.length ? menuItemsListLocal : menuItemsList).map((item: HardwareAllTypes) => (
                                  <MenuItem
                                      key={item._id || item.name}
                                      className={styles.item}
                                      value={item.name}
                                      sx={{
                                          fontFamily: "Inter-400",
                                          fontSize: 12,
                                          color: "#292929",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "16px",
                                      }}
                                      selected={false}
                                      disabled={false}
                                  >
                                      {item.code && (
                                          <img
                                              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item.code}.svg`}
                                              alt={"Flag"}
                                              className={styles.flag}
                                          />
                                      )}
                                      <span className={styles.helper_select_item_text}>{item.name}</span>
                                  </MenuItem>
                              )),
                          ]
                        : [
                              menuItems.length > 10 && (
                                  <SearchItem key="SearchItem-2" type="menuItems" menuL={menuItems} changeMenuItems={changeMenuItems} />
                              ),
                              ...(!!menuItemsLocal.length ? menuItemsLocal : menuItems).map((item: SelectsMenuItemsTypes, i) => (
                                  <MenuItem
                                      key={item.id}
                                      className={styles.item}
                                      value={item.value}
                                      sx={{
                                          fontFamily: "Inter-400",
                                          fontSize: 12,
                                          color: "#292929",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "16px",
                                      }}
                                      selected={item.selected}
                                      disabled={item.disabled}
                                  >
                                      {item.src && <img src={item.src} alt={"Flag"} className={styles.flag} />}
                                      <span className={styles.helper_select_item_text}>
                                          {!!i && renewTeam}
                                          {t(item.text)}
                                      </span>
                                  </MenuItem>
                              )),
                          ]}
                </Select>
            </FormControl>
        </div>
    );
};

export default HelperSelect;
