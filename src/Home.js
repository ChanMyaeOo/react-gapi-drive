import React from 'react';
import { useStateValue } from './context/UserStateProvider';

function Home() {
    const [{user}, dispatch] = useStateValue();

    console.log(user, 'I am from HOME...')
    return (
        <div>
            HOME COMPONENT
        </div>
    )
}

export default Home
