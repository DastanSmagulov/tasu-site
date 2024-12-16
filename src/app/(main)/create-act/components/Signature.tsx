import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureProps {
  onSubmit: (signatureDataUrl: string) => void;
  onUpload: (file: File) => void;
}

const Signature: React.FC<SignatureProps> = ({ onSubmit, onUpload }) => {
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  const handleSave = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert("Пожалуйста, нарисуйте подпись.");
    } else {
      const signatureDataUrl = signaturePadRef.current?.toDataURL();
      if (signatureDataUrl) {
        onSubmit(signatureDataUrl);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border-2 border-gray-800 bg-black pt-1 pb-1 px-3">
        <label className="text-gray-300">Подпись заказчика:</label>
        <SignatureCanvas
          ref={signaturePadRef}
          penColor="blue"
          canvasProps={{
            width: 500,
            height: 200,
            className: "bg-gray-100 border",
          }}
        />
        <label onClick={handleClear} className="text-gray-300">
          Reset
        </label>
      </div>

      <div className="flex gap-4 mt-4 text-[#000000]">
        <button
          onClick={handleSave}
          className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
        >
          Отправить
        </button>
        <span className="mt-2 font-semibold">Или</span>
        <label className="border font-semibold border-gray-500 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 text-black cursor-pointer">
          Расспечатать
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Signature;
