export const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return { icon: 'solar:file-download-bold', color: 'text-red-500' };
    case 'doc':
    case 'docx':
      return { icon: 'solar:document-bold', color: 'text-blue-500' };
    case 'xls':
    case 'xlsx':
    case 'csv':
      return {
        icon: 'solar:checklist-minimalistic-bold',
        color: 'text-green-600',
      };
    case 'jpg':
    case 'png':
    case 'img':
      return { icon: 'solar:gallery-bold', color: 'text-purple-500' };
    default:
      return { icon: 'solar:file-text-bold', color: 'text-slate-400' };
  }
};
