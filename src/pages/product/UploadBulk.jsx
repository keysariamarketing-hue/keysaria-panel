import { Upload } from "antd";
import { AlertCircle, FileSpreadsheet, X } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx"

const UploadBulk = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    setLoading(true);
    setError(null);

    if (!file) return;

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      setLoading(false);
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setFileData({
        name: file.name,
        size: (file.size / 1024).toFixed(2), // Convert to KB
        rows: jsonData.length,
        preview: jsonData.slice(0, 5), // Preview first 5 rows
      });

      if (onFileUpload) {
        onFileUpload(file);
      }
    } catch (err) {
      console.log(err);
      setError('Error processing file. Please try again.');
    }
    setLoading(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    await processFile(file);
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    setFile(file);
    await processFile(file);
  };

  const handleRemove = () => {
    setFileData(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto p-4'>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          ${fileData ? 'border-green-300' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        <input
          ref={inputRef}
          type='file'
          className='hidden'
          accept='.xlsx,.xls,.csv'
          onChange={handleChange}
        />

        {loading ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
            <p className='mt-4 text-sm text-gray-600'>Processing file...</p>
          </div>
        ) : fileData ? (
          <div className='space-y-4'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center space-x-3'>
                <FileSpreadsheet className='h-8 w-8 text-green-500' />
                <div>
                  <p className='font-medium text-gray-900'>{fileData.name}</p>
                  <p className='text-sm text-gray-500'>
                    {fileData.size}KB • {fileData.rows} rows
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className='text-gray-400 hover:text-gray-500'>
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='border rounded-lg overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b'>
                <h3 className='font-medium text-gray-900'>Preview</h3>
              </div>
              <div className='p-4 max-h-60 overflow-auto'>
                <pre className='text-sm text-gray-600'>
                  {JSON.stringify(fileData.preview, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8'>
            <Upload className='h-12 w-12 text-gray-400' />
            <p className='mt-2 text-sm font-medium text-gray-900'>
              Drop your Excel file here, or{' '}
              <button
                onClick={() => inputRef.current?.click()}
                className='text-blue-500 hover:text-blue-600'>
                browse
              </button>
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              Supports: .xlsx, .xls, .csv
            </p>
          </div>
        )}

        {error && (
          <div className='absolute -bottom-16 left-0 right-0 flex items-center p-4 text-red-800 bg-red-50 rounded-lg'>
            <AlertCircle className='h-5 w-5 mr-2' />
            <span className='text-sm'>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBulk;
