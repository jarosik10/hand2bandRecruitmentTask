import React, { useEffect, useReducer, useContext, useState, useRef, useCallback } from 'react';
import Unsplash, { toJson } from 'unsplash-js';
import styles from './Photos.module.css';
import { Context } from '../../Store';
import Searchbar from '../../components/Searchbar/Searchbar';
import Masonry from 'react-masonry-css';
import Modal from '../../components/Modal/Modal';
import PhotoDetails from '../../components/PhotoDetails/PhotoDetails';
import Spinner from '../../components/Spinner/Spinner';

const actionTypes = {
    LOAD_PHOTOS: 'LOAD_PHOTOS',
    LOAD_MORE_PHOTOS: 'LOAD_MORE_PHOTOS',
    CLEAR_PHOTOS: 'CLEAR_PHOTOS',
    FETCHING_PHOTOS: 'FETCHING_PHOTOS',
    NEXT_PAGE: 'NEXT_PAGE',
    RESET_PAGES: 'RESET_PAGES',
}

const Photos = () => {
    const clearPhotos = (state, action) => {
        return {
            ...state,
            photos: [],
        }
    }

    const loadPhotos = (state, { photos }) => {
        return {
            ...state,
            photos: photos,
        }
    }

    const loadMorePhotos = (state, { photos }) => {
        return {
            ...state,
            photos: state.photos.concat(photos),
        }
    }

    const fetchingPhotos = (state, { fetching }) => {
        return {
            ...state,
            fetching: fetching,
        }
    }

    const photosReducer = (state, action) => {
        switch (action.type) {
            case actionTypes.LOAD_PHOTOS:
                return loadPhotos(state, action);
            case actionTypes.LOAD_MORE_PHOTOS:
                return loadMorePhotos(state, action);
            case actionTypes.FETCHING_PHOTOS:
                return fetchingPhotos(state, action);
            case actionTypes.CLEAR_PHOTOS:
                return clearPhotos(state, action);
            default:
                return state;
        }
    }

    const [photosData, photosDispatch] = useReducer(photosReducer, { photos: [], fetching: false });
    const [photosKeyword] = useContext(Context);
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhotoID, setSelectedPhotoID] = useState('');
    const loaderRef = useRef(null);
    const totalPagesRef = useRef(0);


    const fetchPhotos = async (keyword, page, perPage) => {
        photosDispatch({ type: actionTypes.FETCHING_PHOTOS, fetching: true });
        const unsplash = new Unsplash({ accessKey: 'PmJ3exi-C387llc_wG3orSqe8kb2hYMxQu8IWCG3GDI' });
        const photos = await unsplash.search.photos(keyword, page, perPage)
            .then(toJson)
            .then(result => {
                const totalPages = result.total_pages;
                totalPagesRef.current = totalPages;
                const images = result.results.map(({ id, alt_description, blur_hash, urls: { thumb, small, regular, raw } }) => {
                    return {
                        id: id,
                        alt: alt_description,
                        blurHash: blur_hash,
                        urls: {
                            thumb,
                            small,
                            medium: `${raw}&fm=jpg&w=600&fit=max`,
                            regular,
                        },
                    }
                })
                photosDispatch({ type: actionTypes.FETCHING_PHOTOS, fetching: false });
                return images;
            })
            .catch(error => {
                console.log(error);
                photosDispatch({ type: actionTypes.FETCHING_PHOTOS, fetching: false });
                return null;
            });
        return photos;
    }

    useEffect(() => {
        photosDispatch({ type: actionTypes.CLEAR_PHOTOS });
        totalPagesRef.current = 0;
        fetchPhotos(photosKeyword, 1, 10).then(images => {
            photosDispatch({ type: actionTypes.LOAD_PHOTOS, photos: images });
        });
        if (page > 1) {
            setPage(0);
        }
    }, [photosKeyword]);

    useEffect(() => {
        if (page > 1 && photosKeyword) {
            fetchPhotos(photosKeyword, page, 10).then(images => {
                photosDispatch({ type: actionTypes.LOAD_MORE_PHOTOS, photos: images });
            });
        }
    }, [page])

    const loadMore = useCallback(entries => {
        if (page >= totalPagesRef.current) {
            return;
        }
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                setPage(prevState => prevState + 1);
            }
        });
    }, [setPage, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(loadMore);
        const loader = loaderRef.current;
        if (loader) {
            observer.observe(loader);
        }

        return () => observer.unobserve(loader);

    }, [loaderRef, loadMore]);

    const openModal = (id) => {
        setSelectedPhotoID(id);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const masonryBreakingPoints = {
        default: 3,
        1024: 2,
        640: 1,
    };
    
    return (
        <div className={styles.Wrapper}>
            {isModalOpen ?
                <Modal exitHandler={closeModal}>
                    <PhotoDetails id={selectedPhotoID} />
                </Modal> : null}
            <Searchbar isSmall />
            {photosData.photos ?
                <Masonry
                    breakpointCols={masonryBreakingPoints}
                    className={styles.Masonry_grid}
                    columnClassName={styles.Masonry_grid__Column}>
                    {photosData.photos.map(({ urls: { small, medium }, alt, id }) => {
                        return <div onClick={() => openModal(id)} className={styles.Photo_container} key={id}>
                            <picture>
                                <img
                                    className="lazy_image"
                                    src={small}
                                    srcSet={`${small} 400w,
                                    ${medium} 600w`}
                                    sizes=" (min-width: 1024px) calc(calc(100vw - 32px) / 3),
                                    (min-width: 620px) calc(calc(100vw - 16px) / 2),
                                    100vw"
                                    alt={alt} />
                            </picture>
                        </div>
                    })}
                </Masonry> :
                <p className={styles.Message}>No images found.</p>}
            {photosData.fetching && <Spinner />}
             <div ref={loaderRef} ></div>
        </div>
    );
}

export default Photos;