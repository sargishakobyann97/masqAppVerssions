import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowRightIcon from "../../../assets/images/svg/profiles/ArrowRightIcon";
import { HelperMoteItemsTypes } from "../../../types";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { addProfilesToFolderAsync, moveProfileToFolderAsync } from "../../../store/features/profilesSlice";
import { helpers } from "../../../assets/helpers";
import { useLocation } from "react-router-dom";
import styles from "./helper_more_items.module.scss";

const HelperMoreItems = ({ menuItems, profileId = "", fromFolderId }: HelperMoteItemsTypes) => {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const dispatch = useAppDispatch();
    const {
        profiles: {
            foldersList: { folders, favoriteProfilesFolder },
            teamsFolders,
        },
        account: { token, hash },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [nestedMenuAnchorEl, setNestedMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [forAddNestedMenuAnchorEl, setForAddNestedMenuAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNestedMenuClick = (event: React.MouseEvent<HTMLElement>, name: string) => {
        name === t("profiles.more_items.move_to_folder")
            ? setNestedMenuAnchorEl(event.currentTarget)
            : setForAddNestedMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setNestedMenuAnchorEl(null);
        setForAddNestedMenuAnchorEl(null);
        setAnchorEl(null);
    };
    const moveOrAddProfileToFolder = (toFolderId: string, name: string) => {
        if (name === t("profiles.more_items.move_to_folder")) {
            dispatch(
                moveProfileToFolderAsync({
                    deviceInfo,
                    hash,
                    token,
                    profileId: profileId + "",
                    fromFolderId: fromFolderId + "",
                    toFolderId,
                    teamInfo,
                })
            );
        } else if (name === t("profiles.more_items.add_to_folder")) {
            dispatch(addProfilesToFolderAsync({ deviceInfo, hash, token, folderId: toFolderId, profileIds: [profileId], teamInfo }));
        }
        setNestedMenuAnchorEl(null);
        setForAddNestedMenuAnchorEl(null);
        setAnchorEl(null);
    };

    const [hovered, setHovered] = useState<string>("");

    let allFolders = [
        ...folders.filter((item) => item._id !== fromFolderId),
        { _id: favoriteProfilesFolder._id, name: favoriteProfilesFolder.name, icon: "icon_star" },
    ];

    if (teamInfo.teamId) {
        ///@ts-ignore
        const tFolder = teamsFolders[teamInfo.teamName]?.customFoldersProfilesList?.filter((item) => item?._id !== fromFolderId);
        tFolder &&
            (allFolders = [
                ...tFolder,
                ///@ts-ignore
                { _id: teamsFolders[teamInfo.teamName]?.favoriteProfilesList?._id, name: "Favorite", icon: "icon_star" },
            ]);
    }

    const changeHovered = (value: string) => {
        setHovered(value);
    };
    const clearHovered = () => {
        setHovered("");
    };

    return (
        <>
            <Button
                id={styles.button_wrapper}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            ></Button>
            <Menu
                id={styles.basic_menu}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{ sx: { width: "166px", boxShadow: "-1px 1px 5px 0px rgba(0, 0, 0, 0.25)", borderRadius: "5px" } }}
            >
                {menuItems.map(
                    ({ id, icon, name, callBack, disabled }) =>
                        !disabled && (
                            <MenuItem
                                key={id}
                                onClick={(e) => {
                                    if (name === t("profiles.more_items.move_to_folder")) {
                                        !nestedMenuAnchorEl ? handleNestedMenuClick(e, name) : setNestedMenuAnchorEl(null);
                                    } else if (name === t("profiles.more_items.add_to_folder")) {
                                        !forAddNestedMenuAnchorEl ? handleNestedMenuClick(e, name) : setNestedMenuAnchorEl(null);
                                    } else {
                                        callBack({ itemId: profileId });
                                        setAnchorEl(null);
                                    }
                                }}
                                onMouseEnter={() => changeHovered(id)}
                                onMouseLeave={clearHovered}
                                className={styles.folder_page_menu_item}
                            >
                                {icon(id === hovered)}
                                <span className={styles.folder_page_menu_item_name}>{name}</span>
                                {name === t("profiles.more_items.move_to_folder") && (
                                    <>
                                        <ArrowRightIcon fill={!!hovered} />
                                        <Menu
                                            anchorEl={nestedMenuAnchorEl}
                                            open={Boolean(nestedMenuAnchorEl)}
                                            onClose={handleClose}
                                            PaperProps={{
                                                sx: { minWidth: "137px", boxShadow: "-1px 1px 5px 0px rgba(0, 0, 0, 0.25)", borderRadius: "5px" },
                                            }}
                                        >
                                            {allFolders.map((item) => (
                                                <MenuItem
                                                    onClick={() => moveOrAddProfileToFolder(item._id, name)}
                                                    className={styles.more_items_folder_wrapper}
                                                    key={item._id}
                                                >
                                                    <div className={item.icon}></div>
                                                    <p className={styles.more_items_folder_name} title={name.length > 13 ? name : ""}>
                                                        {item.name}
                                                    </p>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                )}
                                {name === t("profiles.more_items.add_to_folder") && (
                                    <>
                                        <ArrowRightIcon fill={!!hovered} />
                                        <Menu
                                            anchorEl={forAddNestedMenuAnchorEl}
                                            open={Boolean(forAddNestedMenuAnchorEl)}
                                            onClose={handleClose}
                                            PaperProps={{
                                                sx: { minWidth: "137px", boxShadow: "-1px 1px 5px 0px rgba(0, 0, 0, 0.25)", borderRadius: "5px" },
                                            }}
                                        >
                                            {allFolders.map((item) => (
                                                <MenuItem
                                                    onClick={() => moveOrAddProfileToFolder(item._id, name)}
                                                    className={styles.more_items_folder_wrapper}
                                                    key={item._id}
                                                >
                                                    <div className={item.icon}></div>
                                                    <p className={styles.more_items_folder_name} title={name.length > 13 ? name : ""}>
                                                        {item.name}
                                                    </p>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                )}
                            </MenuItem>
                        )
                )}
            </Menu>
        </>
    );
};

export default HelperMoreItems;
