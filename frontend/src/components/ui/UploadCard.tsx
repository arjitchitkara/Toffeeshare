import { FC } from "react";
import QRCode from "qrcode.react";

interface UploadCardProps {
  fileName: string;
  fileLink: string;
}

const UploadCard: FC<UploadCardProps> = ({ fileName, fileLink }) => {
  return (
    <div className="max-w-sm bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2">{fileName}</h2>
      <p className="text-gray-400 mb-4">0.25 MB</p>
      <a
        href={fileLink}
        className="text-orange-500 mb-4 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {fileLink}
      </a>
      <div className="mb-4">
        <QRCode value={fileLink} size={128} />
      </div>
      <div className="flex justify-around mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Share
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Nearby
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Fallback
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        Closing this page means you stop sharing! Simply keep this page open in
        the background to keep sharing.
      </p>
    </div>
  );
};

export default UploadCard;
