import Supplier from "../models/Supplier.js";

export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Supplier name is required",
      });
    }

    const supplier = await Supplier.create({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    await supplier.update(req.body);

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    await supplier.destroy();

    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};