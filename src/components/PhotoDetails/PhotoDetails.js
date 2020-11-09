import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import Unsplash, { toJson } from 'unsplash-js';
import styles from './PhotoDetails.module.css';
import Spinner from '../../components/Spinner/Spinner';

const actionTypes = {
    LOAD_PHOTO: 'LOAD_PHOTO',
    FETCHING_PHOTO: 'FETCHING_PHOTO',
}

const PhotoDetails = ({ id }) => {
    const loadPhoto = (state, { photo }) => {
        return {
            ...state,
            photo: photo,
        }
    }

    const fetchingPhoto = (state, { fetching }) => {
        return {
            ...state,
            fetching: fetching,
        }
    }

    const photoReducer = (state, action) => {
        switch (action.type) {
            case actionTypes.LOAD_PHOTO:
                return loadPhoto(state, action);
            case actionTypes.FETCHING_PHOTO:
                return fetchingPhoto(state, action);
            default:
                return state;
        }
    }

    const [photoData, photoDispatch] = useReducer(photoReducer, { photo: null, fetching: false });

    const fetchPhoto = async (id) => {
        photoDispatch({ type: actionTypes.FETCHING_PHOTO, fetching: true });
        const unsplash = new Unsplash({ accessKey: 'PmJ3exi-C387llc_wG3orSqe8kb2hYMxQu8IWCG3GDI' });
        const photo = await unsplash.photos.getPhoto(id)
            .then(toJson)
            .then(result => {
                const { id, alt_description, blur_hash, urls: { thumb, small, regular, raw }, location: { city, country }, user: { name }, width, height } = result;
                const image = {
                    id: id,
                    alt: alt_description,
                    blurHash: blur_hash,
                    urls: {
                        thumb,
                        small,
                        medium: `${raw}&fm=jpg&w=600&fit=max`,
                        regular,
                    },
                    location: {
                        city,
                        country
                    },
                    author: name,
                    width: width,
                    height: height,
                }
                photoDispatch({ type: actionTypes.FETCHING_PHOTO, fetching: false });
                return image;
            })
            .catch(error => {
                console.log(error);
                photoDispatch({ type: actionTypes.FETCHING_PHOTO, fetching: false });
                return null;
            });
        return photo;
    }

    useEffect(() => {
        fetchPhoto(id).then(photo => photoDispatch({ type: actionTypes.LOAD_PHOTO, photo: photo }));
    }, [id]);

    let photoDetails = (
        <div className={styles.Container}>
            <Spinner />
        </div>
    );
    let author;
    let location;
    let widthToHeightRatio;
    let heightToWidthRatio;
    if (photoData.photo) {
        const { city, country } = photoData.photo.location;
        const { width, height } = photoData.photo;
        author = photoData.photo.author || "Uknown";
        location = city && country ? `${city}, ${country}` : country || null;
        widthToHeightRatio = width / height;
        heightToWidthRatio = height / width;

        photoDetails = (
            <div className={styles.Container}>
                <p className={styles.Author}>Author: {author} </p>
                {location && <p className={styles.Location}>{location}</p>}
                <div style={{ maxWidth: `calc((100vh - 237px) * ${widthToHeightRatio})`, margin: '0 auto' }}>
                    <div style={{ paddingBottom: `${heightToWidthRatio * 100}%` }} className={styles.Image}>
                        <picture>
                            <img
                                src={photoData.photo.urls.small}
                                srcSet={`${photoData.photo.urls.small} 400w,
                                    ${photoData.photo.urls.medium} 600w,
                                    ${photoData.photo.urls.regular} 1080w`}
                                alt={photoData.photo.alt} />
                        </picture>
                    </div>
                </div>
            </div>
        )
    }

    return photoDetails;
}

PhotoDetails.propTypes ={
    id: PropTypes.string.isRequired,
}

export default PhotoDetails;