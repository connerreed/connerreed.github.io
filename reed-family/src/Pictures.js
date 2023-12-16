import React from 'react';
import Gallery from './Gallery';
import UploadForm from './UploadForm';

function Pictures({pictureList}) {
    return(
        <div style={{position: 'relative'}}>
            <UploadForm formType="pictures"/>
            <Gallery elementList={pictureList} elementType="pictures"/>
        </div>
    );
}

export default Pictures;