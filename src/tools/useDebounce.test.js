import useDebounce from './useDebounce'
import React, { useState, useEffect } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import * as tes from '@testing-library/react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import App from './../App'
import { act } from 'react-dom/test-utils';

let container = null;

beforeEach(() => {
    // set up a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});
jest.setTimeout(20000)

function resolveAfterSeconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, x * 1000);
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("TEST useDebounce ", () => {
    test("empty", async () => {
    });

    test("hook", async () => {
        console.log('tes', tes)
        //console.log('getByTestId', tes.getByTestId)
    });

    test("useDebounce", async () => {
        console.log('debouncedSearchTerm start test ')

        const Asd = () => {
            const [searchTerm, setSearchTerm] = useState("000");
            const debouncedSearchTerm = useDebounce(searchTerm, 500);
            console.log('debouncedSearchTerm init', debouncedSearchTerm)

            useEffect(
                () => {
                    if (debouncedSearchTerm) {
                        console.log('debouncedSearchTerm hook', debouncedSearchTerm)
                    } else {
                    }
                },
                [debouncedSearchTerm] // Only call effect if debounced search term changes
            );
            //setTimeout(setSearchTerm, 200, "abc")
            //setSearchTerm("abc")

            return (<div />)
        }
        render(<Asd />, container)
        act()
        //asd()
        await resolveAfterSeconds(4);
    });
});

// it("App loads with initial state of 0", () => {
//     const { container } = render(<App />);
//     const countValue = getByTestId(container, "isLoading");
//     expect(countValue.textContent).toBe("0");
// });
