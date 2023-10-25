import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import UsernameBalance from "../Account/accountPages/UsernameBalance";
import styles from "./home.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const homeInitialState = {
    isAccountMoreOptionOpen: false,
};

function Home() {
    const { t } = useTranslation();

    const modalRef = useRef<HTMLDivElement | null>(null);
    const [homeData, setHomeData] = useState(homeInitialState);
    const changeHomeData = (type: string, value: string | boolean) => setHomeData({ ...homeData, [type]: value });
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            changeHomeData("isAccountMoreOptionOpen", false);
        }
    };

    return (
        <div className={styles.home_wrapper} onClick={handleModalClick}>
            <div className={styles.home_main}>
                <div className={styles.home_slider_recommended_wrapper}>
                    <div className={styles.home_username_balence}>
                        <UsernameBalance isOpen={homeData.isAccountMoreOptionOpen} changeOpen={changeHomeData} modalRef={modalRef} />
                    </div>
                    <div className={styles.home_slider_wrapper}>
                        <Swiper
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            className={styles.mySwiper}
                        >
                            <SwiperSlide className={styles.swiper_item}>1</SwiperSlide>
                            <SwiperSlide className={styles.swiper_item}>2</SwiperSlide>
                            <SwiperSlide className={styles.swiper_item}>3</SwiperSlide>
                            <SwiperSlide className={styles.swiper_item}>4</SwiperSlide>
                        </Swiper>
                    </div>
                    <div className={styles.home_recommended_wrapper}>
                        <h2>{t("home.recommended")}</h2>
                        <div className={styles.recommended_items}>
                            <div className={styles.recommended_item}></div>
                            <div className={styles.recommended_item}></div>
                            <div className={styles.recommended_item}></div>
                            <div className={styles.recommended_item}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
