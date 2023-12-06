import React from 'react';
import Gallery from './Gallery';
import pictureList from './pictureData';

function Pictures() {
    return(
        <div>
            <Gallery elementList={pictureList}/>
        </div>
    );
}

export default Pictures;