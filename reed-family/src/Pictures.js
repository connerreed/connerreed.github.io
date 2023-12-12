import React from 'react';
import Gallery from './Gallery';

function Pictures({pictureList}) {
    return(
        <div>
            <Gallery elementList={pictureList} elementType="pictures"/>
        </div>
    );
}

export default Pictures;