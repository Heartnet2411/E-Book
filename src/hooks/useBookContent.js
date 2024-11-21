import { useEffect, useState } from 'react';
import { convert } from 'html-to-text';

function useBookContent(book) {
    const handleSearch = async (searchString) => {
        return Promise.all(
            book.spine.spineItems.map((item) =>
                item
                    .load(book.load.bind(book))
                    .then(item.find.bind(item, searchString))
                    .finally(item.unload.bind(item))
            )
        ).then((results) => Promise.resolve([].concat.apply([], results)));
    };

    return {
        searchBookContents: handleSearch,
    };
}

export default useBookContent;
