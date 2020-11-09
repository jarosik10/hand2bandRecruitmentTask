import React from 'react';
import styles from './Hero.module.css';
import smallImage from '../../assets/images/cherry-blossom_640.jpg';
import mediumImage from '../../assets/images/cherry-blossom_1280.jpg';
import bigImage from '../../assets/images/cherry-blossom_1920.jpg';
import Searchbar from '../../components/Searchbar/Searchbar'

const Hero = () => {
    return (
        <div className={styles.Wrapper}>
            <h1 className={styles.Header}>What would you like to see?</h1>
            <Searchbar />
            <p className={styles.Paragraph}>Explore Unsplash.</p>
            <p className={styles.Paragraph}>The internet’s source of freely-usable images.</p>
            <p className={styles.Paragraph}>Powered by creators everywhere.</p>
            <div className={styles.Image}>
                <picture>
                    <img srcSet={`${smallImage} 640w,
                                ${mediumImage} 1280w,
                                ${bigImage} 1920w`}
                        src={smallImage}
                        alt="Cherry blossom" />
                </picture>
            </div>
        </div>

    );
}

export default Hero;