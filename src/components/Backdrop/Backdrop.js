import React from 'react';
import PropTypes from 'prop-types';
import styles from './Backdrop.module.css'

const Backdrop = ({ handleClick }) => {
    return <div className={styles.Backdrop} onClick={handleClick}></div>
}

Backdrop.propTypes = {
    handleClick: PropTypes.func.isRequired,
}

export default Backdrop;