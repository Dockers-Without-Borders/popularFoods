import React from 'react'
import styles from './carouselItem.module.css';


const CarouselItem = ({ last, imageUrl, price, name, photoNumber, reviewNumber, displayModal }) => {
    return (
        <div className={last ? `${styles.container} ${styles.last}` : styles.container} onClick={() => { displayModal(name) }}>
            <div className={styles.foodImage} style={{ backgroundImage: `url(${imageUrl})` }} >
                <div className={styles.price}>${price}</div>
            </div>
            <div className={styles.contentContainer}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.flexRow}>
                    <div className={styles.photoNumber}>{photoNumber} Photos </div><div className={styles.reviewNumber}> • {reviewNumber} Reviews</div>
                </div>
            </div>
        </div >
    );
};

export default CarouselItem;