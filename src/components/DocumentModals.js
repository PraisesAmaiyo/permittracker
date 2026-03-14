import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDistanceStrict, isBefore } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Button from './ui/Button';

export default function DocumentModals({
  isPreviewOpen,
  setIsPreviewOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  selectedDoc, // The doc object from the table
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(null);

  const [uploading, setUploading] = useState(false);

  // Calculate duration for the "Spice" factor
  const getDuration = () => {
    if (startDate && expiryDate) {
      if (isBefore(expiryDate, startDate)) return 'Invalid Range';
      return formatDistanceStrict(startDate, expiryDate);
    }
    return 'Select dates';
  };

  const [formData, setFormData] = useState({
    name: '',
    expiryDate: '',
    category: 'NUPRC', // Default value
  });

  // State for categories (Eventually this comes from Supabase)
  const [categories, setCategories] = useState([
    'NUPRC',
    'Safety',
    'Safety (DPR)',
    'Environmental',
    'Tax (LIRS/FIRS)',
  ]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  // 2. UPDATE FORM DATA HANDLER
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If user selects the "+ Add New" option in dropdown
    if (name === 'category' && value === 'new') {
      setShowAddCategory(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = newCategoryName.trim();
      setCategories([...categories, newCat]);

      // 3. FIX: Update formData so the dropdown immediately selects the new category
      setFormData((prev) => ({ ...prev, category: newCat }));

      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleSavePermit = async () => {
    if (!selectedFile || !formData.name) {
      return toast.error('Missing Information', {
        description: 'Please provide a permit name and a file.',
      });
    }

    setUploading(true);
    const toastId = toast.loading('Starting upload process...');

    try {
      // 1. UPLOAD FILE TO STORAGE
      const fileExt = selectedFile.name.split('.').pop();
      const baseName = selectedFile.name.replace(`.${fileExt}`, '');

      const cleanName = baseName.replace(/\s+/g, '_');

      const fileName = `${cleanName}_${Date.now()}.${fileExt}`;
      const filePath = fileName;
      // const filePath = `permits/${fileName}`;

      toast.loading('Uploading file to storage...', { id: toastId });

      let { error: uploadError } = await supabase.storage
        .from('permits')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. GET THE PUBLIC URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('permits').getPublicUrl(filePath);

      // Update toast to show we are saving to the database
      toast.loading('Saving details to database...', { id: toastId });

      // 3. SAVE RECORD TO DATABASE
      const { error: dbError } = await supabase.from('permits').insert([
        {
          name: formData.name,
          category_id: 'e61a7e8d-9106-4105-8cb4-d3e0d8417c5a', // We'll link ID later, for now text is fine
          issue_date: startDate.toISOString(),
          expiry_date: expiryDate.toISOString(),
          file_url: publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      // FINAL SUCCESS: Replace the loading toast with a success message
      toast.success('Permit saved successfully!', {
        id: toastId,
        description: `${formData.name} has been added to your dashboard.`,
      });

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving permit:', error.message);
      toast.error('Action Failed', {
        id: toastId,
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* 1. PDF PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {selectedDoc?.name || 'Document Preview'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDoc?.category}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <Icon icon="solar:close-circle-bold" fontSize={24} />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-950">
              {/* Placeholder logic: Always shows the same file but feels dynamic */}
              <iframe
                src="/sample-permit.pdf#toolbar=0"
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD NEW PERMIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 custom-scrollbar relative">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Upload New Permit
            </h2>

            <div className="space-y-4 ">
              {/* Permit Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Permit Name
                </label>
                <input
                  type="text"
                  required
                  name="name" // Added name
                  value={formData.name} // Added value
                  onChange={handleInputChange} // Added onChange
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. NUPRC Operational Permit"
                />
              </div>
              {/* // UI Section for the Date Selection */}
              <div className="grid grid-cols-1 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Validity Period
                  </label>
                  {expiryDate && (
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        getDuration() === 'Invalid Range'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-primary/10 text-primary dark:text-slate-400'
                      }`}
                    >
                      {getDuration()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* START DATE */}
                  <div className="relative">
                    <p className="text-[10px] text-slate-400 mb-1 ml-1">
                      Issued On
                    </p>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={10}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white focus:ring-2 focus:ring-primary"
                      placeholderText="Issue Date"
                    />
                  </div>

                  {/* EXPIRY DATE */}
                  <div className="relative">
                    <p className="text-[10px] text-slate-400 mb-1 ml-1">
                      Expires On
                    </p>
                    <DatePicker
                      selected={expiryDate}
                      onChange={(date) => setExpiryDate(date)}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={10}
                      minDate={startDate} // Prevents picking date before start
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white focus:ring-2 focus:ring-primary"
                      placeholderText="Expiry Date"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* Permit Expiry Date */}
                {/* <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate" // Added name
                    value={formData.expiryDate} // Added value
                    onChange={handleInputChange} // Added onChange
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-sm"
                  />
                </div> */}

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Category
                  </label>
                  <select
                    name="category" // Added name
                    value={formData.category} // Controlled value
                    onChange={handleInputChange} // Logic to show modal if 'new' is picked
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-sm dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="text-[10px] text-primary font-bold mt-1 hover:underline"
                  >
                    + Create Custom Category
                  </button>
                </div>
              </div>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                } ${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                />

                <Icon
                  icon={
                    selectedFile
                      ? 'solar:check-circle-bold'
                      : 'solar:cloud-upload-bold'
                  }
                  className={`mx-auto mb-2 ${selectedFile ? 'text-green-500' : 'text-primary'}`}
                  fontSize={32}
                />

                <p className="text-sm font-medium dark:text-slate-300">
                  {selectedFile
                    ? selectedFile.name
                    : 'Click to upload or drag & drop'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : 'PDF, PNG or JPG (max. 10MB)'}
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePermit}
                  loading={uploading}
                  className="flex-1"
                >
                  Save Permit
                </Button>
              </div>
            </div>
          </div>

          {/* Small Sub-Modal for adding category */}
          {showAddCategory && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-80 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold mb-3 dark:text-white">
                  New Category
                </h3>
                <input
                  autoFocus
                  className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none mb-4 dark:text-white"
                  placeholder="Category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewCategory}
                    className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
