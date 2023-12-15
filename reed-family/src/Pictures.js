import React from 'react';
import Gallery from './Gallery';
import PictureUploadForm from './PictureUploadForm';

function Pictures({pictureList}) {
    return(
        <div style={{position: 'relative'}}>
            <PictureUploadForm style={{top: '0', left: '0'}}/>
            <Gallery elementList={pictureList} elementType="pictures"/>
        </div>
    );
}

export default Pictures;