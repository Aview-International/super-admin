import Image from 'next/image';

const AllVideos = () => {
  return (
    <div>
      <h2>Videos Selection</h2>
      <div>
        <Image src={null} alt="" />
        <div>
          <p className="text-xl font-semibold">Logan Paul and fans suprise</p>
          <p className="text-lg">Logan Paul</p>
        </div>
      </div>
    </div>
  );
};

export default AllVideos;
