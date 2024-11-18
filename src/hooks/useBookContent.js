import { useEffect, useState } from 'react';
import { convert } from 'html-to-text';

function useBookContent(book) {
    const [bookContents, setBookContents] = useState([]);

    const getBookContents = async () => {
        const spine = await book.loaded.spine;
        const contents = [];
        for (let item of spine.items) {
            if (!item.href) continue;
            console.log(item);
            const doc = await book.load(item.href);
            const innerHTML = doc.documentElement.innerHTML;
            const innerText = convert(innerHTML);
            // const paragraphs = innerText.split(/\n+/);

            contents.push({
                href: item.href,
                text: innerText.split(/\n+/),
            });
        }
        setBookContents(contents);
    };
    const searchText = (searchString) => {
        const regexp = new RegExp(searchString, 'ig');

        const res = [];
        for (let content of bookContents) {
            for (let paragraph of content.text) {
                if (paragraph.match(regexp) !== null) {
                    res.push({
                        paragraph,
                        href: content.href,
                    });
                }
            }
        }

        return res;
    };

    useEffect(() => {
        if(book){
        getBookContents();
        }
        }, [book]);

    return {
        bookContents,
        searchBookContents: searchText,
    };
}

export default useBookContent;
