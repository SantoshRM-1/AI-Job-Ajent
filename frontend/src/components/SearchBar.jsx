import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Search, MapPin, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSearchClick = () => {
    if (!query.trim()) return;
    onSearch({ query, location, file });
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Job Title Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-900/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="e.g. Machine Learning Engineer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Location Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-900/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="City, State, or 'Remote'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        {...getRootProps()} 
        className={`mt-4 flex justify-center px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-2">
          {file ? (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
              <p className="mt-2 text-sm text-green-300 font-medium">{file.name} uploaded successfully</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-300">
                <span className="font-semibold text-blue-400">Click to upload PDF</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Resume matching enabled</p>
            </div>
          )}
        </div>
      </div>

      {/* Explicit Trigger Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSearchClick}
          disabled={isLoading || !query.trim()}
          className={`px-8 py-3 w-full md:w-auto rounded-xl font-bold tracking-wide text-white transition-all shadow-lg ${
            isLoading || !query.trim()
              ? 'bg-blue-600/50 cursor-not-allowed text-white/50'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              AI is Thinking...
            </span>
          ) : (
            "Match Jobs"
          )}
        </button>
      </div>
    </div>
  );
}
