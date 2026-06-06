import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeading from "../components/PageHeading";

import toast from "react-hot-toast";

import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setProducts(response.data.products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/orders",
        {
          customerName,
          items: [
            {
              productId: Number(selectedProduct),
              quantity: Number(quantity),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      setCustomerName("");

      setSelectedProduct("");

      setQuantity(1);

      fetchOrders();

      fetchProducts();

      toast.success("Order created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    toast.success(`Order marked as ${status}`);
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "CREATED":
        return "PACKED";

      case "PACKED":
        return "SHIPPED";

      case "SHIPPED":
        return "DELIVERED";

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <PageHeading>Orders</PageHeading>

      {/* Create Order Form */}

      <form
        onSubmit={handleCreateOrder}
        className="bg-slate-800 border border-slate-700 p-4 rounded-2xl mb-6 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-3">Create Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
            required
          />

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 pr-10 rounded-lg appearance-none transition text-sm"
            required
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ( Stock:
                {product.quantity})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none p-2.5 rounded-lg transition text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded-lg mt-4 text-sm font-medium"
        >
          Create Order
        </button>
      </form>

      {/* Orders Table */}

      <div className="bg-slate-800 rounded-2xl overflow-x-auto border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Total</th>

              <th className="p-4 text-left">Items</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="p-4">{order.customerName}</td>

                <td className="p-4">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {order.status}
                  </span>
                </td>

                <td className="p-4">₹{order.totalAmount}</td>

                <td className="p-4">
                  {order.OrderItems?.map((item) => (
                    <div key={item.id}>
                      {item.Product?.name}
                      {" x "}
                      {item.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-4">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, getNextStatus(order.status))
                      }
                      className="bg-green-600 px-4 py-2 rounded-lg"
                    >
                      Mark as {getNextStatus(order.status)}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
