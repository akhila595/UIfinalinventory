import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface CustomerContextType {
  customerId: number | null;
  customerName: string | null;
  setCustomer: (id: number | null, name: string | null) => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  // ==========================================
  // Load from localStorage on first mount
  // ==========================================
  useEffect(() => {
    const storedId = localStorage.getItem("selectedCustomerId");
    const storedName = localStorage.getItem("selectedCustomerName");

    if (storedId && !isNaN(Number(storedId))) {
      setCustomerId(Number(storedId));
    }

    if (storedName) {
      setCustomerName(storedName);
    }
  }, []);

  // ==========================================
  // Set selected customer
  // ==========================================
  const setCustomer = (id: number | null, name: string | null) => {
    if (id === null) {
      clearCustomer();
      return;
    }

    setCustomerId(id);
    setCustomerName(name ?? null);

    localStorage.setItem("selectedCustomerId", id.toString());
    if (name) {
      localStorage.setItem("selectedCustomerName", name);
    } else {
      localStorage.removeItem("selectedCustomerName");
    }
  };

  // ==========================================
  // Clear customer context
  // ==========================================
  const clearCustomer = () => {
    setCustomerId(null);
    setCustomerName(null);
    localStorage.removeItem("selectedCustomerId");
    localStorage.removeItem("selectedCustomerName");
  };

  return (
    <CustomerContext.Provider
      value={{
        customerId,
        customerName,
        setCustomer,
        clearCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

// ==========================================
// Custom hook (Superadmin only)
// ==========================================
export const useCustomer = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used inside CustomerProvider");
  }

  return context;
};
