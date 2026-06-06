import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeading from "../components/PageHeading";
import ConfirmationModal from "../components/ConfirmationModal";

import api from "../services/api";

import toast from "react-hot-toast";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);

  const [restockData, setRestockData] = useState({
    sku: "",
    quantity: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    SupplierId: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [page, search]);

  const getToken = () => localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/products?page=${page}&limit=5&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      setProducts(response.data.products);

      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setSuppliers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch suppliers");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Product deleted successfully");

      setPendingDeleteProduct(null);

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Product created successfully");

      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: "",
        SupplierId: "",
      });

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products/restock", restockData);

      toast.success("Stock updated");

      setRestockData({
        sku: "",
        quantity: "",
      });

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Restock failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4 gap-3">
        <PageHeading>Products</PageHeading>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 p-2.5 rounded-lg text-sm w-48 md:w-64"
        />
      </div>

      <ConfirmationModal
        open={Boolean(pendingDeleteProduct)}
        title="Confirm delete action"
        message={
          pendingDeleteProduct
            ? `Delete ${pendingDeleteProduct.name}? This product will be removed permanently.`
            : ""
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        onConfirm={() => handleDelete(pendingDeleteProduct.id)}
        onCancel={() => setPendingDeleteProduct(null)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] gap-4 mb-4">
        <form
          onSubmit={handleCreateProduct}
          className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-lg"
        >
          <h2 className="text-lg font-bold mb-3">Create Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
              required
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
              required
            />

            <select
              name="SupplierId"
              value={formData.SupplierId}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 pr-10 rounded-lg appearance-none transition text-sm"
              required
            >
              <option value="">Select Supplier</option>

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 px-4 py-2 rounded-lg mt-4 text-sm font-medium disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Product"}
          </button>
        </form>

        <form
          onSubmit={handleRestock}
          className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-lg"
        >
          <h2 className="text-lg font-bold mb-3">Restock Product</h2>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="SKU"
              value={restockData.sku}
              onChange={(e) =>
                setRestockData({
                  ...restockData,
                  sku: e.target.value,
                })
              }
              className="bg-slate-700 p-2.5 rounded-lg text-sm"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={restockData.quantity}
              onChange={(e) =>
                setRestockData({
                  ...restockData,
                  quantity: e.target.value,
                })
              }
              className="bg-slate-700 p-2.5 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded-lg mt-3 text-sm font-medium"
          >
            Restock
          </button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-2xl overflow-x-auto border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">SKU</th>

              <th className="p-4 text-left">Price</th>

              <th className="p-4 text-left">Quantity</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-10">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-10 text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4">{product.name}</td>

                  <td className="p-4">{product.sku}</td>

                  <td className="p-4">₹{product.price}</td>

                  <td className="p-4">{product.quantity}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.quantity <= 5
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {product.quantity <= 5 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setPendingDeleteProduct(product)}
                      className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-slate-700 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-slate-700 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
