import Image from 'next/image';
import blob1 from '../../public/img/blobs/blob-1.webp';
import blob2 from '../../public/img/blobs/blob-2.webp';
import blob3 from '../../public/img/blobs/blob-3.webp';
import blob4 from '../../public/img/blobs/blob-4.webp';

const Blobs = () => {
  return (
    <>
      <div className={`absolute -right-[5%] -top-[5%] -z-30 w-[70vw]`}>
        <Image src={blob1} alt="blob2" />
      </div>
      <div className={`absolute -left-[30vw] top-[80vh] -z-30 w-[70vw]`}>
        <Image src={blob2} alt="blob2" />
      </div>
      <div className={`absolute -right-[30vw] top-[200vh] -z-30 w-[90vw]`}>
        <Image src={blob3} alt="blob3" />
      </div>
      <div className={`absolute -left-[10vw] top-[250vh] -z-30 w-[80vw]`}>
        <Image src={blob4} alt="blob4" />
      </div>
    </>
  );
};

export default Blobs;
