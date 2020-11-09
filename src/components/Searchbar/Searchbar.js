import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import styles from './Searchbar.module.css';
import { Context } from '../../Store';
import Autosuggest from 'react-autosuggest';
import WORDS from '../../assets/data/common_words.json';
import { ReactComponent as MagnifierSVG } from '../../assets/images/iconmonstr-magnifier.svg';

const MIN_LETTERS_NUMBER = 3;
const MAX_SUGGESTIONS_NUMBER = 5;

const Searchbar = ({ isSmall }) => {

    const getSuggestions = (value) => {
        if (value.length < MIN_LETTERS_NUMBER) {
            setShowMessage(false);
            return [];
        }
        const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${escapedValue.trim()}`, 'i');
        const suggestions = WORDS.filter(word => regex.test(word));

        if (suggestions.length === 0) {
            setShowMessage(true);
        } else{
            setShowMessage(false);
        }

        return suggestions.length > MAX_SUGGESTIONS_NUMBER ? suggestions.slice(0, MAX_SUGGESTIONS_NUMBER) : suggestions;
    }

    const renderSuggestion = (suggestion) => {
        return (
            <span>{suggestion}</span>
        );
    }

    const getSuggestionValue = (suggestion) => {
        return suggestion;
    }

    const [photosKeyword, setPhotosKeyword] = useContext(Context);
    const [inputValue, setInputValue] = useState(photosKeyword);
    const [suggestions, setSuggestions] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const history = useHistory();

    const handleOnChange = (event, { newValue, method }) => {
        setInputValue(newValue);
    };

    const handleOnSuggestionsFetchRequested = ({ value, reason }) => {
        setSuggestions(getSuggestions(value));
    }

    const handleOnSuggestionsClearRequested = () => {
        setSuggestions([]);
    }

    const inputProps = {
        placeholder: "Search the universe of Unsplash",
        value: inputValue,
        onChange: handleOnChange,
        required: true
    };

    const handleOnSubmit = (event) => {
        event.preventDefault();
        let keyword = inputValue.trim();
        if (keyword) {
            setPhotosKeyword(keyword)
            history.push("/photos");
        }
    }

    return (
        <>
            <form className={isSmall ? [styles.Form, styles.Form_small].join(' ') : styles.Form} onSubmit={handleOnSubmit}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={handleOnSuggestionsFetchRequested}
                    onSuggestionsClearRequested={handleOnSuggestionsClearRequested}
                    onSuggestionSelected={handleOnSubmit}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    theme={styles}
                />
                <button type="submit" className={styles.Button}>
                    <MagnifierSVG className={styles.MagnifierSVG} />
                </button>
                {showMessage && <div className={styles.Message}>No suggestions found.</div>}
            </form>
        </>

    );

}

Searchbar.propTypes = {
    isSmall: PropTypes.bool,
}

export default Searchbar;