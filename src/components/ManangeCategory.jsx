import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { InputField, Modal } from './SmallComponents';
import { LocalClient } from '../Api/API_Client';
import { API } from '../Api/Endpoints';
import { toast } from 'react-toastify';

const ManageCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setFormData] = useState({ category: "" });
  const [categories, setCategories] = useState([]); // State for category list

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await LocalClient.get(API.getCategory); // Adjust endpoint as needed
      if (response.status === 200) {
        console.log(" thsis is the ategory",response.data);
        
        setCategories(response.data || []); // Adjust based on API response structure
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.log("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "KM" || name === "hours" ? Number(value) : value, // Convert KM & Hours to number
    }));
  };
  

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!data.category.trim()) {
      alert("Category cannot be empty!");
      return;
    }
console.log(" this is the category modal data ",data);

    try {
      const response = await LocalClient.post(API.createCategory, data);
      if (response.status === 201) {
        toast.success("Category created");
        fetchCategories(); // Refresh category list
        setIsOpen(false);
        setFormData({ category: "" }); // Reset form
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Category</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Category List</h3>
          {categories.length > 0 ? (
            <div className="max-h-250 overflow-y-auto"> {/* Max height and scroll */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"> {/* Sticky header */}
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Hr
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Km
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <tr key={index}>
                      {/* Category Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.name}
                      </td>
                      
                    
                      {/* Hours */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.hours !== null ? category.hours+ " Hr" : "N/A"}
                      </td>
                        {/* KM */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.KM !== null ? category.KM+ " Km" : "N/A"}
                      </td>

                    </tr>
                  ))}
</tbody>

              </table>
            </div>
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Category">
  <form onSubmit={handleCategorySubmit}>
    {/* Category Input */}
    <InputField
      label="Category"
      type="text"
      name="category"
      value={data.category}
      onChange={handleInputChange}
      placeholder="Enter Category"
      required
    />

    {/* KM Input */}
    <InputField
      label="KM"
      type="number"
      name="KM"
      value={data.KM || ""}
      onChange={handleInputChange}
      placeholder="Enter KM"
     
    />

    {/* Hours Input */}
    <InputField
      label="Hours"
      type="number"
      name="hours"
      value={data.hours || ""}
      onChange={handleInputChange}
      
    />

    {/* Buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </div>
  </form>
</Modal>

    </div>
  );
};

export default ManageCategory;