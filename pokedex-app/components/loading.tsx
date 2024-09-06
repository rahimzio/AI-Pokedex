import React, { useState, useEffect } from 'react';

interface LoadingComponentProps {
    isLoading: boolean;
    loadingMessage: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ isLoading, loadingMessage }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isFastSpin, setIsFastSpin] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsPaused(true);
                setTimeout(() => {
                    setIsPaused(false);
                    setIsFastSpin(true);
                    setTimeout(() => {
                        setIsFastSpin(false);
                    }, 500); 
                }, 1000); 
            }, 2000); 
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className='loading'>
                <img
                    src='/pokeball.png'
                    className={`${isPaused ? 'paused' : ''} ${isFastSpin ? 'fast-spin' : ''}`}
                    alt="Loading"
                />
                <p className="text-center mt-8">{loadingMessage}</p>
            </div>
        );
    }

    return null;
};

export default LoadingComponent;
