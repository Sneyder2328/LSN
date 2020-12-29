import {NavBar} from "../../../components/NavBar/NavBar";
import styles from './styles.module.scss'
import {Scrollbar} from "react-scrollbars-custom";
import {BottomMsgsBar} from "../../../components/BottomMessagingBar/BottomMsgsBar";
import {NotificationSystem} from "../../../components/NotificationSystem/NotificationSystem";
import React from "react";

type Props = {
    LeftComponents?: React.ComponentType<any> | React.ReactElement | null;
    MainComponents?: React.ComponentType<any> | React.ReactElement | null;
    RightComponents?: React.ComponentType<any> | React.ReactElement | null;
}
export const ThreeSectionsPage: React.FC<Props> = ({LeftComponents, MainComponents, RightComponents}) => {
    return (
        <div>
            <main>
                <div className={styles.pageContainer}>
                    <div className={styles.leftSection}>
                        <Scrollbar thumbYProps={{className: styles.thumbY}} trackYProps={{className: styles.trackY}}>
                            {LeftComponents}
                        </Scrollbar>
                    </div>
                    <div className={styles.mainSection}>
                        {MainComponents}
                    </div>
                    <div className={styles.rightSection}>
                        <Scrollbar thumbYProps={{className: styles.thumbY}} trackYProps={{className: styles.trackY}}>
                            {RightComponents}
                        </Scrollbar>
                    </div>
                </div>
            </main>
        </div>
    );
};