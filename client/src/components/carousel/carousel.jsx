import React, { Component, Suspense, lazy } from 'react';
import Modal from "../modal/modal.jsx";
const CarouselItem = React.lazy(() => import('../carouselItem/carouselItem.jsx'));
import LeftScrollIcon from './icons/leftScrollIcon.jsx';
import RightScrollIcon from './icons/rightScrollIcon.jsx';
import regeneratorRuntime from "regenerator-runtime";
import styles from "./carousel.module.css";

class Carousel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dishes: [],
            dishToDisplay: '',
            dishToDisplayIndex: 0,
            modalActive: false,
            scrollPosition: 0,
            maxScrollLength: 0,
            debounceTimer: 0
        }
        this.carouselWrapper = React.createRef();
        this.scrollLeft = this.scrollLeft.bind(this);
        this.scrollRight = this.scrollRight.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.debounceScroll = this.debounceScroll.bind(this);
        this.displayModal = this.displayModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('http://localhost:3000/api/tests/threedish')
        const data = await response.json();
        this.setState({ dishes: data.dishes }, () => {
            const scrollContainer = document.getElementsByClassName(`${styles.itemContainer}`)[0];
            const newMaxScrollLength = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            this.setState({
                maxScrollLength: newMaxScrollLength
            }, () => {
                scrollContainer.addEventListener('scroll', this.debounceScroll);
            })
        });
    }

    componentWillUnmount() {
        document.getElementsByClassName(`${styles.itemContainer}`)[0].removeEventListener('scroll', this.debounceScroll);
    }
    handleScroll(e) {
        this.setState({
            scrollPosition: e.target.scrollLeft
        });
    }
    debounceScroll(e) {
        const currentTime = new Date();
        if (currentTime - this.state.debounceTimer > 20) {
            this.setState({
                debounceTimer: currentTime
            }, () => {
                setTimeout(() => {
                    this.handleScroll(e);
                }, 20)
            })
        }

    }
    scrollRight() {
        this.carouselWrapper.current.scrollBy({
            top: 0,
            left: 100,
            behavior: 'smooth'
        });
    }
    scrollLeft() {
        this.carouselWrapper.current.scrollBy({
            top: 0,
            left: -100,
            behavior: 'smooth'
        });
    }

    displayModal(name, index) {
        this.setState({
            dishToDisplay: name,
            dishToDisplayIndex: index
        }, () => {
            this.setState({ modalActive: true })
        })
    }

    closeModal(e) {
        if (e.target === e.currentTarget) {
            this.setState({
                dishToDisplay: '',
                modalActive: false
            })
        }
    }

    render() {
        return (
            <div>
                {this.state.modalActive && <Modal dish={this.state.dishToDisplay} dishIndex={this.state.dishToDisplayIndex} closeModal={this.closeModal} />}
                <div className={styles.container}>
                    <div className={styles.titleContainer}>
                        <h4>Popular Dishes</h4>
                        <div className={styles.fakeLink}>View Full Menu</div>
                    </div>
                    <div className={styles.scrollContainer}>
                        {this.state.scrollPosition > 2 && <button className={`${styles.scrollButton} ${styles.leftScrollButton}`} onClick={this.scrollLeft}><LeftScrollIcon /></button>}
                        <div className={styles.itemContainer} ref={this.carouselWrapper}>
                            {this.state.dishes.map((dish, index) => {
                                return (
                                    <Suspense fallback={<div>Loading ... </div>}>
                                        <CarouselItem
                                            displayModal={this.displayModal}
                                            index={index}
                                            last={index === this.state.dishes.length - 1 ? true : false}
                                            imageUrl={dish.imageUrl}
                                            price={dish.price}
                                            name={dish.name}
                                            photoNumber={dish.photoNumber}
                                            reviewNumber={dish.reviewNumber}
                                        />
                                    </Suspense>
                                )
                            })}
                        </div>
                        {this.state.maxScrollLength - this.state.scrollPosition > 2 && <button className={`${styles.scrollButton} ${styles.rightScrollButton}`} onClick={this.scrollRight}><RightScrollIcon /></button>}
                    </div>
                </div>
            </div>
        )
    }
}
export default Carousel;


