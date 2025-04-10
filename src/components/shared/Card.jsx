import React from "react";

const Card = ({summary}) => {
    return(
        <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2">
            <div className="bg-primary rounded-md flex flex-col items-center justify-center p-4">
                <h1 className="font-extrabold text-4xl text-white">{summary?.sports > 0 ? summary.sports : 0}</h1>
                <span className="text-base font-semibold uppercase text-white">Total Sport's</span>
            </div>
            <div className="bg-primary rounded-md flex flex-col items-center justify-center p-4">
                <h1 className="font-extrabold text-4xl text-white">{summary?.coaches > 0 ? summary?.coaches : 0}</h1>
                <span className="text-base font-semibold uppercase text-white">Total Coaches</span>
            </div>
            <div className="bg-primary rounded-md flex flex-col items-center justify-center p-4">
                <h1 className="font-extrabold text-4xl text-white">{summary?.athletes > 0 ? summary?.athletes : 0}</h1>
                <span className="text-base font-semibold uppercase text-white">Total Athletes</span>
            </div>
        </div>
    )
}

export default Card;