import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Backdrop from '../Backdrop/Backdrop';

const Modal = ({ exitHandler, children }) => {
    const modalRef = useRef(null)
    useEffect(() => {
        const modal = modalRef.current;
        disableBodyScroll(modal);
        return () => enableBodyScroll(modal);
    })

    return (
        <>
            <Backdrop handleClick={exitHandler} />
            <div ref={modalRef} className={styles.Modal}>
                <button onClick={exitHandler} className={styles.ExitButton}></button>
                {children}
            </div>
        </>
    );
};

Modal.propTypes = {
    exitHandler: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
}

export default Modal;