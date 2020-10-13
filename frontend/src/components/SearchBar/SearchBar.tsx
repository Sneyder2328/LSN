import React, {useEffect, useRef, useState} from "react";
import SearchResults from "./SearchResults";
import {connect} from "react-redux";
import {searchUser} from "./searchActions";
import useOnClickOutside from 'use-onclickoutside';
import styles from './styles.module.scss'

type Props = {
    searchUser: (query: string) => any;
};

const SearchBar: React.FC<Props> = ({searchUser}) => {
    const ref = useRef(null);
    const [resultsVisible, setResultsVisible] = useState(false);
    useOnClickOutside(ref, () => setResultsVisible(false));

    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        console.log('query changed', query);
        query.length >= 2 && searchUser(query);
    }, [query]);

    const onHandleChange = (evt: any) => {
        setQuery(evt.target.value);
        setResultsVisible(true);
    };

    return (
        <div ref={ref} className={styles.searchContainer}>
            <div className={styles.searchBox} onClick={() => setResultsVisible(true)}>
                <div className={styles.searchIcon}>
                    <i className="fas fa-search"/>
                </div>
                <input className={styles.searchInput} placeholder='Search people' onChange={onHandleChange} value={query}/>
            </div>
            {resultsVisible && <SearchResults query={query}/>}
        </div>
    );
};

export default connect(null, {searchUser})(SearchBar);