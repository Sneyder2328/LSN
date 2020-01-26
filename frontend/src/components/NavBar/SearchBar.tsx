import React, {useEffect, useState} from "react";
import SearchResults from "./SearchResults";
import {connect} from "react-redux";
import {searchUser} from "./searchActions";

type Props = {
    searchUser: (query: string) => any;
};

const SearchBar: React.FC<Props> = ({searchUser}) => {
    const [query, setQuery] = useState<string>("");
    useEffect(() => {
        console.log('query changed', query);
        query.length >= 2 && searchUser(query);
    }, [query]);
    return (
        <div>
            <input className='search-box' placeholder='Search people' onChange={(evt) => setQuery(evt.target.value)}
                   value={query}/>
            <SearchResults query={query}/>
        </div>
    );
};

export default connect(null, {searchUser})(SearchBar);