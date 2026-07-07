import { useState } from 'react';
import useCategories from '../hooks/useCategories';
import CategoryModal from '../components/categories/CategoryModal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { createCategory, updateCategory, deleteCategory } from '../api/categories';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateCategory(editing._id, data);
        toast.success('Category updated');
      } else {
        await createCategory(data);
        toast.success('Category created');
      }
      setModalOpen(false);
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Expenses will be moved to Uncategorized.')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const defaultCats = categories.filter((c) => c.isDefault);
  const customCats = categories.filter((c) => !c.isDefault);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-12" />
      ) : (
        <>
          {customCats.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-gray-500 mb-3">Custom Categories</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {customCats.map((cat) => (
                  <div key={cat._id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(cat); setModalOpen(true); }}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cat._id)}>
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-medium text-gray-500 mb-3">Default Categories</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {defaultCats.map((cat) => (
                <div key={cat._id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <Lock size={14} className="text-gray-400" />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        category={editing}
      />
    </div>
  );
}
