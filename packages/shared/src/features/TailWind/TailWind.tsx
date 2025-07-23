import { type ReactNode } from 'react';

export const TailWind = (): ReactNode => {
  return (
    <>
      <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center gap-x-4'>
        <div>
          <div className='text-xl font-medium text-black'>ChitChat</div>
          <p className='text-slate-500'>You have a new message!</p>
        </div>
      </div>

      <div className='box-border h-32 w-32 p-4 border-4 ...'>하</div>

      {/* <div className='p-4 grid grid-cols-4 gap-4'>
        {Array.from({ length: 100 }, (_, idx) => idx).map(list => {
          const isOdd = list % 2 === 0;
          return (
            <div
              key={list}
              className={
                isOdd ? `aspect-square bg-red-300` : `aspect-video bg-green-300`
              }
            >
              {list}
            </div>
          );
        })}
      </div> */}
    </>
  );
};
