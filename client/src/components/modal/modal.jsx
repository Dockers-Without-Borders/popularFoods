import React, { Component, Suspense, lazy } from "react";
import ModalImageDisplay from "./modalImageDisplay/modalImageDisplay.jsx";
import ModalReview from "./modalReview/modalReview.jsx";
import ModalReviewContainer from "./modalReviewContainer/modalReviewsContainer.jsx";
import RightScrollIcon from "../carousel/icons/rightScrollIcon.jsx";
import LeftScrollIcon from "../carousel/icons/leftScrollIcon.jsx";
import styles from "./modal.module.css";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      dishes: this.props.dishes,
      pictures: [],
      previousDish: "",
      currentDish: this.props.dish,
      nextDish: "",
      dishIndex: this.props.dishIndex,
      pictureIndex: 0,
      picturesActive: false,
    };
    this.displayNextImage = this.displayNextImage.bind(this);
    this.displayPreviousImage = this.displayPreviousImage.bind(this);
    this.nextDish = this.nextDish.bind(this);
    this.previousDish = this.previousDish.bind(this);
    this.fetchDishPictureData = this.fetchDishPictureData.bind(this);
  }
  displayNextImage() {
    if (this.state.pictureIndex === this.state.pictures.length - 1) {
      this.setState({ pictureIndex: 0 });
    } else {
      this.setState(state => ({ pictureIndex: state.pictureIndex + 1 }));
    }
  }
  displayPreviousImage() {

    if (this.state.pictureIndex === 0) {
      this.setState(state => ({ pictureIndex: state.pictures.length - 1 }));
    } else {
      this.setState(state => ({ pictureIndex: state.pictureIndex - 1 }));
    }
  }
  nextDish() {
    this.setState(
      state => ({
        dishIndex: state.dishIndex + 1,
        currentDish: state.nextDish,
        nextDish: state.dishes[state.dishIndex + 2].name,
        previousDish: state.currentDish,
      }),
      () => {
        this.fetchDishPictureData();
        this.fetchDishReviewData();

      }
    );
  }
  previousDish() {
    this.setState(
      state => ({
        dishIndex: state.dishIndex - 1,
        currentDish: state.previousDish,
        nextDish: state.currentDish,
        previousDish: state.dishes[state.dishIndex - 2].name,
      }),
      () => {
        this.fetchDishPictureData();
        this.fetchDishReviewData();
      }
    );
  }
  async fetchDishPictureData() {
    let param;
    for (let i = 0; i < this.state.dishes.length; i++) {
      if (this.state.dishes[i].name === this.state.currentDish) {
        param = this.state.dishes[i].id;

        break;
      }
    }

    const response = await fetch(
      `http://localhost:3002/api/images/dish/${param}`
    );
    const data = await response.json();

    console.log('FETCH DISH PIC',data);
    
    this.setState(
      {
        pictures: data,
        pictureIndex: 0,
      },
      () => {
        this.setState({ picturesActive: true });
      }
    );
  }
  async fetchDishReviewData() {
    const response = await fetch(`http://localhost:3002/api/reviews/dish/${this.state.currentDish}`);
    const data = await response.json();

    console.log('FETCH DISH REVIEW', data)

    this.setState({ reviews: data })
  }
  async componentDidMount() {

    this.fetchDishReviewData();
    if (this.state.dishIndex === 0) {
      this.setState(state => ({
        nextDish: state.dishes[1].name,
      }));
    } else if (this.state.dishIndex === this.state.dishes.length - 1) {
      this.setState(state => ({
        previousDish: state.dishes[this.state.dishIndex - 1].name,
      }));
    } else {
      this.setState(state => ({
        nextDish: state.dishes[this.state.dishIndex + 1].name,
        previousDish: state.dishes[this.state.dishIndex - 1].name,
      }));
    }
    this.fetchDishPictureData();
  }
  render() {
    let imageSrc;
    let caption;
    if (this.state.picturesActive) {
      imageSrc = this.state.pictures[this.state.pictureIndex].source;
      caption = this.state.pictures[this.state.pictureIndex].caption;
    } else {
      imageSrc = "";
      caption = null;
    }
    return (
      <div className={styles.container} onClick={this.props.closeModal}>
        <div className={styles.closeButton} onClick={this.props.closeModal}>
          Close X
        </div>
        <div className={styles.contentContainer}>
          <ModalImageDisplay
            picturesActive={this.state.picturesActive}
            image={imageSrc}
            imageIndex={this.state.pictureIndex}
            caption={caption}
            imageQuantity={this.state.pictures ? this.state.pictures.length : 0}
            displayNextImage={this.displayNextImage}
            displayPreviousImage={this.displayPreviousImage}
          />
          <ModalReviewContainer
            dish={this.state.currentDish}
            reviewQuantity={this.state.reviews.length}
            reviews={this.state.reviews}
          />
        </div>
        {this.state.dishIndex !== 0 && (
          <div className={styles.previousDish} onClick={this.previousDish}>
            <span>{this.state.previousDish}</span>{" "}
            <LeftScrollIcon fill="white" />
          </div>
        )}
        {this.state.dishIndex !== this.state.dishes.length - 1 && (
          <div className={styles.nextDish} onClick={this.nextDish}>
            <span>{this.state.nextDish}</span> <RightScrollIcon fill="white" />
          </div>
        )}
      </div>
    );
  }
}
export default Modal;
