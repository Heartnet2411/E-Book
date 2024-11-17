import { useEffect, useState } from 'react';
import { convert } from 'html-to-text';

function useBookContent(book) {
    const [bookContents, setBookContents] = useState([]);

    const getBookContents = async () => {
        const spine = await book?.loaded?.spine;
        const contents = [];

        for (let item of spine.items) {
            if (!item.href) continue;

            const doc = await book.load(item.href);
            const innerHTML = doc.documentElement.innerHTML;
            const innerText = convert(innerHTML);
            const paragraphs = innerText.split(/\n+/);

            for (let [index, paragraph] of paragraphs.entries()) {
                // Tính toán CFI cho từng đoạn
                const range = doc.createRange();
                const element = doc.body.children[index];
                if (element) {
                    range.selectNodeContents(element);
                }

                const cfi = book?.cfiFromRange(range);
                contents.push({
                    
                    href: cfi,
                    text: innerText.split(/\n+/),
                });
            }
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
        getBookContents();
    }, []);

    return {
        bookContents,
        searchBookContents: searchText,
    };
}

export default useBookContent;
