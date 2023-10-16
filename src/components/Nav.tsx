
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Nav = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <nav className='fixed flex items-center flex-wrap bg-transparent p-3 '>

        <Link
          href="https://tapped.ai"
          target="_blank"
          rel="noopener noreferrer"
          className='inline-flex items-center p-2 mr-4 '
        >
          <Image
            src='/images/icon_1024.png'
            width={75}
            height={75}
            alt='tapped logo'
          />
          <div className='w-6'></div>
          <span className='text-xl text-black font-bold uppercase tracking-wide'>
              TAPPED AI
          </span>
        </Link>
        <button
          className=' inline-flex p-3 hover:bg-blue-500 rounded lg:hidden text-black ml-auto hover:text-black outline-none'
          onClick={handleClick}
        >

        </button>
        {/* Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div
          className={`${
            active ? '' : 'hidden'
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>
            <Link
              href='https://tapped.ai'
              target="_blank"
              rel="noopener noreferrer"
              className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-center hover:bg-blue-500 hover:text-black '
            >
                home
            </Link>
            <Link
              href='https://getmusicmarketing.com'
              target="_blank"
              rel="noopener noreferrer"
              className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-center hover:bg-blue-500 hover:text-black'
            >
                marketing
            </Link>
            <Link
              href='https://viralsocialmediaideas.com'
              target="_blank"
              rel="noopener noreferrer"
              className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-center hover:bg-blue-500 hover:text-black'
            >
                social media
            </Link>
            <Link
              href='https://getmusicnewsletters.com'
              target="_blank"
              rel="noopener noreferrer"
              className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-center hover:bg-blue-500 hover:text-black'
            >
                newsletter
            </Link>
            <Link
              href='mailto://support@tapped.ai'
              className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-center hover:bg-blue-500 hover:text-black'
            >
                contact us
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;