import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import css from "styled-jsx/css";

const headerStyle = css`
    
    .logo {
        display: flex;
        font-weight: bold;
        font-size: 8rem;
        font-family: 'Noto Sans KR';
    }
    a {
        width: 7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        text-decoration: none;
        height: 3rem;
        
    }
    
`;

function Header( props ) {
   
    return (
        <>
            <Head>
                <title>next-pract</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <style jsx>{headerStyle}</style>
        </>
    );
}

export default Header;