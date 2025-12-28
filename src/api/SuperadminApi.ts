import axios from "@/api/axios";

/*  
 ===========================================
 🔐 COMMON LOGIN (Shared for all users)
 ===========================================
*/
export const login = async (payload: { email: string; password: string }) => {
  return (await axios.post("/api/auth/login", payload)).data;
};

/*  
 ===========================================
 🛑 SUPER ADMIN SECTION (Core APIs)
 ===========================================
*/

/*  
 -------------------------------------------
 📊 DASHBOARD STATS
 Backend endpoint:
 GET /api/dashboard/stats
 -------------------------------------------
*/
export const getDashboardStats = async () =>
  (await axios.get("/api/dashboard/stats")).data;

/*  
 -------------------------------------------
 👤 USERS CRUD
 Backend endpoints:
 GET    /api/users
 POST   /api/users
 PUT    /api/users/{id}
 DELETE /api/users/{id}
 -------------------------------------------
*/
export const getUsers = async () =>
  (await axios.get("/api/users")).data;

export const createUser = async (payload: any) =>
  (await axios.post("/api/users", payload)).data;

export const updateUser = async (id: string, payload: any) => {
  const token = localStorage.getItem("token");

  return (
    await axios.put(`/api/users/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};


export const deleteUser = async (id: string) =>
  (await axios.delete(`/api/users/${id}`)).data;

/*  
 -------------------------------------------
 🛡 ROLES CRUD
 Backend:
 GET    /api/roles
 POST   /api/roles
 PUT    /api/roles/{id}
 DELETE /api/roles/{id}
 -------------------------------------------
*/
export const getRoles = async () =>
  (await axios.get("/api/roles")).data;

export const createRole = async (payload: any) =>
  (await axios.post("/api/roles", payload)).data;

export const updateRole = async (id: string, payload: any) =>
  (await axios.put(`/api/roles/${id}`, payload)).data;

export const deleteRole = async (id: string) =>
  (await axios.delete(`/api/roles/${id}`)).data;

/*  
 -------------------------------------------
 🧩 PERMISSIONS CRUD
 Backend:
 GET    /api/permissions
 POST   /api/permissions
 PUT    /api/permissions/{id}
 DELETE /api/permissions/{id}
 -------------------------------------------
*/
export const getPermissions = async () =>
  (await axios.get("/api/permissions")).data;

export const createPermission = async (payload: any) =>
  (await axios.post("/api/permissions", payload)).data;

export const updatePermission = async (id: string, payload: any) =>
  (await axios.put(`/api/permissions/${id}`, payload)).data;

export const deletePermission = async (id: string) =>
  (await axios.delete(`/api/permissions/${id}`)).data;

/*  
 -------------------------------------------
 🔗 ROLE → PERMISSION ASSIGNMENT
 Backend:
 GET  /api/roles/{id}/permissions
 POST /api/roles/{id}/permissions
 -------------------------------------------
*/
export const getRolePermissions = async (roleId: number) =>
  (await axios.get(`/api/roles/${roleId}/permissions`)).data;

export const assignPermissionsToRole = async (
  roleId: number,
  permissionIds: number[]
) =>
  (
    await axios.post(`/api/roles/${roleId}/permissions`, {
      permissionIds,
    })
  ).data;

/*  
 -------------------------------------------
 📜 LOGS
 Backend:
 GET /api/logs
 -------------------------------------------
*/
export const getLogs = async () =>
  (await axios.get("/api/logs")).data;

/*  
 -------------------------------------------
 👤 GET USER ROLES
 Backend:
 GET /api/roles/user/{userId}
 -------------------------------------------
*/
export const getUserRoles = async (userId: number) =>
  (await axios.get(`/api/roles/user/${userId}`)).data;

/*  
 ===========================================
 🏢 SUPER ADMIN — CUSTOMER MANAGEMENT
 (NEW SECTION)
 ===========================================
*/

/*  
 -------------------------------------------
 🏗 CREATE CUSTOMER + ADMIN
 Backend:
 POST /api/superadmin/create-customer
 -------------------------------------------
*/
export const createCustomerWithAdmin = async (payload: any) =>
  (await axios.post("/api/superadmin/create-customer", payload)).data;

/*  
 -------------------------------------------
 👥 GET ALL CUSTOMERS
 Backend:
 GET /api/superadmin/customers
 -------------------------------------------
*/
export const getAllCustomers = async () =>
  (await axios.get("/api/superadmin/customers")).data;

/* -------------------------------------------
 🧹 DELETE CUSTOMER
 Backend: DELETE /api/superadmin/customers/{id}
------------------------------------------- */
export const deleteCustomer = async (id: number) =>
  (await axios.delete(`/api/superadmin/customers/${id}`)).data;

/* -------------------------------------------
 ✏️ UPDATE CUSTOMER
 Backend: PUT /api/superadmin/customers/{id}
------------------------------------------- */
export const updateCustomer = async (id: number, payload: any) =>
  (await axios.put(`/api/superadmin/customers/${id}`, payload)).data;

/* -------------------------------------------
 👤 VIEW ADMIN (Get users of customer)
 Backend: GET /api/users?customerId={id} (you can adjust later)
------------------------------------------- */
export const getCustomerAdmins = async (customerId: number) =>
  (await axios.get(`/api/superadmin/customers/${customerId}`)).data;

export const getUserById = async (id: number) =>
  (await axios.get(`/api/users/${id}`)).data;

export const uploadUserProfileImage = async (
  userId: number,
  formData: FormData
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `/api/users/${userId}/profile-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data; // { imageUrl }
};
