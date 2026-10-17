import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

const PdfViewer = ({ pdfFile }: { pdfFile: File | null }) => {
  return (
    <div>
      <div>
        {pdfFile && (
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={URL.createObjectURL(pdfFile)} />
          </Worker>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
