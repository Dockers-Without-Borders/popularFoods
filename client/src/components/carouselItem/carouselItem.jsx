import React, { Component } from 'react'
import regeneratorRuntime from "regenerator-runtime";
import styles from './carouselItem.module.css';


class CarouselItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: ''
        }
    }
    async componentDidMount() {
        // const response = await fetch(`http://localhost:3002/api/images/thumbnail/${this.props.dishId}`);
        // const data = await response.json();

        console.log('CAROUSEL ITEM DATA', data)

        this.setState({
            imageUrl: data[0].source
        })
    }
    render() {
        let { last, dishId, price, name, photoNumber, reviewNumber, displayModal, index } = this.props;
        return (
            <div className={last ? `${styles.container} ${styles.last}` : styles.container} onClick={() => { displayModal(name, index, dishId) }}>
                <div className={styles.foodImage} style={{ backgroundImage: `url(${this.state.imageUrl})` }} >
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
}

export default CarouselItem;