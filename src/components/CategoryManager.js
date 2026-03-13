import { Icon } from '@iconify/react';

export default function CategoryManager() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Upstream', isSystem: true },
    { id: 2, name: 'Safety', isSystem: true },
    { id: 3, name: 'Custom Site Permit', isSystem: false },
  ]);

  const deleteCategory = (id) => {
    // In the future, this will check Supabase if any permits are using this category first!
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold mb-4 dark:text-white">
        Manage Categories
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group"
          >
            <span className="text-sm dark:text-slate-200">{cat.name}</span>

            <div className="flex gap-2">
              {!cat.isSystem ? (
                <>
                  <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors">
                    <Icon icon="solar:pen-bold" fontSize={16} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" fontSize={16} />
                  </button>
                </>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                  System
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
