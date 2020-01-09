import React, { Component, Suspense, lazy } from "react";
import Modal from "../modal/modal.jsx";
const CarouselItem = React.lazy(() =>
  import("../carouselItem/carouselItem.jsx")
);
import LeftScrollIcon from "./icons/leftScrollIcon.jsx";
import RightScrollIcon from "./icons/rightScrollIcon.jsx";
import regeneratorRuntime from "regenerator-runtime";
import styles from "./carousel.module.css";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
      dishToDisplay: "",
      dishToDisplayId: null,
      dishToDisplayIndex: 0,
      modalActive: false,
      scrollPosition: 0,
      maxScrollLength: 4,
      debounceTimer: 0,
    };
    this.carouselWrapper = React.createRef();
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.debounceScroll = this.debounceScroll.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    // we want this to not make a generic request
    // now this will make custom requests to the carousel, at the current restaurant for all the dishes?
    console.log('NOW when the page loads I get this url regardless of input',window.location.pathname)
    // just try calling it generally first, then customize it to go based on the names inputted
    // it will have to split the string and join using spaces

    // give it a restaurant to default to
    // then just include some restaurants here in comments since I will not remember the random endpoints
    // it should break if a number is put in, but if the right name is put in then it'll be good

    // quaerat ducimus incidunt
    // laudantium ut itaque
    // vel animi tempora
    // dolorum id sed
    // assumenda maxime nesciunt
    // occaecati sunt aut
    // accusantium tenetur at
    // vel quia a

    // NOT REALLY USING THE CLIENT SIDE TO TEST THE SERVER SIDE
    // I might have to reroute these to the seed node database
    // this will be important when I tie in the proxy. but I could test the server for this with this just being local host

    var endpoint = window.location.pathname;
    // if the input in nothing then default to /vel_animi_tempora/
    if ( window.location.pathname === '/') {
      endpoint = '/vel_animi_tempora/'
    }

    const response = await fetch(`http://34.216.9.223:3002/api/carousel${endpoint}`)

    // const response = await fetch("http://localhost:3002/api/dishes");
    const data = await response.json();

    console.log('DATA IN MAIN CAROUSEL', data)

    this.setState({ dishes: data }, () => {
      this.carouselWrapper.current.addEventListener("scroll", this.debounceScroll);
    }
    );

  }

  componentWillUnmount() {
    document
      .getElementsByClassName(`${styles.itemContainer}`)[0]
      .removeEventListener("scroll", this.debounceScroll);
  }
  handleScroll(e) {
    const scrollContainer = this.carouselWrapper.current;
    const newMaxScrollLength =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
    this.setState(
      {
        maxScrollLength: newMaxScrollLength,
        scrollPosition: e.target.scrollLeft,
      })
  }
  debounceScroll(e) {
    const currentTime = new Date();
    if (currentTime - this.state.debounceTimer > 20) {
      this.setState(
        {
          debounceTimer: currentTime,
        },
        () => {
          setTimeout(() => {
            this.handleScroll(e);
          }, 20);
        }
      );
    }
  }
  scrollRight() {
    this.carouselWrapper.current.scrollBy({
      top: 0,
      left: 224,
      behavior: "smooth",
    });
  }
  scrollLeft() {
    this.carouselWrapper.current.scrollBy({
      top: 0,
      left: -224,
      behavior: "smooth",
    });
  }

  displayModal(name, index, dishId) {
    this.setState(
      {
        dishToDisplay: name,
        dishToDisplayId: dishId,
        dishToDisplayIndex: index,
      },
      () => {
        this.setState({ modalActive: true });
      }
    );
  }

  closeModal(e) {
    if (e.target === e.currentTarget) {
      this.setState({
        dishToDisplay: "",
        dishToDisplayId: null,
        modalActive: false,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.modalActive && (
          <Modal
            dishes={this.state.dishes}
            dish={this.state.dishToDisplay}
            dishIndex={this.state.dishToDisplayIndex}
            closeModal={this.closeModal}
          />
        )}
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <h4>Popular Dishes</h4>
            <div className={styles.fakeLink}>View Full Menu</div>
          </div>
          <div className={styles.scrollContainer}>
            {this.state.scrollPosition > 2 && (
              <button
                className={`${styles.scrollButton} ${styles.leftScrollButton}`}
                onClick={this.scrollLeft}
              >
                <LeftScrollIcon />
              </button>
            )}
            <Suspense fallback={<div>Loading ... </div>}>
              <div className={styles.itemContainer} ref={this.carouselWrapper}>
                {this.state.dishes.map((dish, index) => {
                  return (
                    <CarouselItem
                      displayModal={this.displayModal}
                      index={index}
                      last={
                        index === this.state.dishes.length - 1 ? true : false
                      }
                      imageUrl={dish.imageUrl}
                      price={dish.price}
                      name={dish.name}
                      dishId={dish.id}
                      photoNumber={dish.photoNumber}
                      reviewNumber={dish.reviewNumber}
                    />
                  );
                })}
              </div>
            </Suspense>
            {this.state.maxScrollLength - this.state.scrollPosition > 2 && (
              <button
                className={`${styles.scrollButton} ${styles.rightScrollButton}`}
                onClick={this.scrollRight}
              >
                <RightScrollIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Carousel;
